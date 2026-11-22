
//name fields of the two pokemon
const input1 = document.getElementById("pkmn1");
const input2 = document.getElementById("pkmn2");

//every input and select in the two field cards (used to listen for changes)
const fields = document.querySelectorAll(".search-container input, .search-container select");

/**
 * calcualtes the actual in--battle speed of a pokemon.
 * order and rounding follow the games: stats (with nature) -> speed stage -> modifiers -> paralysis
 * @param {number} baseSpeed - base speed stat from pokeAPI
 * @param {number} level - level of the pokemon (1-100)
 * @param {number} evs - speed EVs (0-252)
 * @param {number} ivs - speed IVs (0-31)
 * @param {number} nature - nature multiplier (1.1, 1, 0.9)
 * @param {number} ability - ability multiplier (2, 1.5, 0.5)
 * @param {number} par - paralysis multiplier (0.5, 1)
 * @param {number} tailwind - tailwind multiplier (1.5, 1, 0.5)
 * @param {number} item - item multiplier (1.5, 1, 0.5)
 * @param {number} stage - speed stage (-6 to +6)
 * @returns {number} the final speed
 */
function calculateSpeed(baseSpeed, level, evs, ivs, nature, ability, par, tailwind, item, stage) {

    //speed stat calculated with base speed, evs, ivs and nature
    const step1 = Math.floor((2 * baseSpeed + ivs + Math.floor(evs / 4)) * level / 100);
    const step2 = step1 + 5;
    const step3 = Math.floor(step2 * nature);

    //speed stage [-6,...,+6]
    const step4 = applyStage(step3, stage);

    //ability, tailwind and item are combined and rounded once, like in the game
    const modifier = ability * tailwind * item;
    const step5 = Math.floor(step4 * modifier);

    //paralysis applied last
    const finalSpeed = Math.floor(step5 * par);

    return finalSpeed;
}

/**
 * applies a speed stage to a stat, uses integer fractions instead of decimals to avoid rounding errors
 * @param {number} stat - the stat after the nature 
 * @param {number} stage - the speed stage, from -6 to +6
 * @returns {number} the stat with the stage applied
 */
function applyStage(stat, stage){
    if(stage >= 0){
        return Math.floor(stat * (2 + stage) / 2);
    }
    else{
        return Math.floor(stat * 2 / (2 - stage));
    }
}


/**
 * reads a number field and keeps it between the min/max attributes. Also corrects the value shown in the field
 * @param {string} id - id of the input field
 * @returns {number} the corrected value
 */
function limitNumber(id){
    const field = document.getElementById(id);

    const min = Number(field.min);
    const max = Number(field.max);

    let value = Number(field.value);

    //empty or non-valid field value
    if(isNaN(value) || field.value === ""){
        value = Number(field.defaultValue);
    }
    
    value = Math.min(Math.max(value, min), max); //keep between min and max
    value = Math.floor(value);  //no decimals (if 30.8 -> 30)
      
    field.value = value; //show the corrected value in the field

    return value;
}

/**
 * shows an error next to the "name:" label and clears the pokemon's box
 * @param {number} number - 1 or 2 (which pokemon) 
 * @param {*} message - the error message to show
 */
function showPokemonError(number, message){
    const errorElement = document.getElementById("pkmn" + number + "-error");
    errorElement.textContent = message;
    errorElement.hidden = false;

    document.getElementById("pkmn" + number + "-name").textContent = "--";
    document.getElementById("pkmn" + number + "-speed").textContent = "--";
    document.getElementById("pkmn" + number + "-img").hidden = true;
    document.getElementById("pkmn" + number + "-par").hidden = true;
    document.getElementById("pkmn" + number + "-tailwind").hidden = true;
}

/**
 * fetches a pokemon from pokeAPI, reads the user's settings, calculates the speed and writes everything in the pokemon box
 * @param {string} name - pokemon name (lowecase) 
 * @param {*} number - 1 or 2 (wich pokemon)
 */
async function showPokemon(name, number){
    //empty field: nothing to search, hide any old error
    if(name === ""){
        document.getElementById("pkmn" + number + "-error").hidden = true;
        return;
    } 
    
    //fetch the pokemon
    let response;
    try {
        response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
    } catch (error) {
        //no answer from pokeAPI --> connection error
        showPokemonError(number, "Connection error");
        return;
    }

    //pokeAPI answered with an error --> pokemon not found
    if(!response.ok){
        showPokemonError(number, "Pokemon not found");
        return;
    }

    const data = await response.json();

    document.getElementById("pkmn" + number + "-error").hidden = true;
    
    let baseSpeed;
    for(const s of data.stats){
        if(s.stat.name === "speed"){
            baseSpeed = s.base_stat;
        }
    }

    //reads the user's settings
    const level = limitNumber("level" + number);
    const evs = limitNumber("EVs" + number);
    const ivs = limitNumber("IVs" + number);
    
    const natureSelect = document.getElementById("nature" + number);
    const nature = Number(natureSelect.value); //1.1, 0.9, 1
    const natureName = natureSelect.options[natureSelect.selectedIndex].text; //timid, calm, jolly ...

    const abilitySelect = document.getElementById("ability" + number);
    const ability = Number(abilitySelect.value);
    const abilityName = abilitySelect.options[abilitySelect.selectedIndex].text;
    //data-ability identifies special abilities
    const abilityId = abilitySelect.options[abilitySelect.selectedIndex].dataset.ability;
    //unburden only works after the item is consumed, so no item can be held
    if (abilityId === "unburden") {
        document.getElementById("noitem" + number).checked = true;
    }

    //paralysis halves speed, except with quick feet
    const isParalyzed = document.getElementById("parpkmn"+number).checked;
    let par = 1;
    if(isParalyzed && abilityId !== "quick-feet"){
        par = 0.5;
    }

    const isTailwind = document.getElementById("tailwindpkmn" + number).checked;
    let tailwind = 1;
    if(isTailwind){
        tailwind = 2;
    }

    const itemRadio = document.querySelector('input[name="item' + number + '"]:checked');
    const item = Number(itemRadio.value);
    // the item's name is the text of label linked to the selected radio
    const itemName = document.querySelector('label[for="' + itemRadio.id + '"]').textContent;

    const stage = Number(document.getElementById("stage" + number).value);

    //calculate speed
    const speed = calculateSpeed(baseSpeed, level, evs, ivs, nature, ability, par, tailwind, item, stage);

    //show user's settings
    document.getElementById("pkmn" + number + "-name").textContent = data.name;
    document.getElementById("pkmn" + number + "-level").textContent = level;
    document.getElementById("pkmn" + number + "-nature").textContent = natureName;
    document.getElementById("pkmn" + number + "-EVs").textContent = evs;
    document.getElementById("pkmn" + number + "-IVs").textContent = ivs;
    document.getElementById("pkmn" + number + "-speed").textContent = speed;
    document.getElementById("pkmn" + number + "-ability").textContent = abilityName;
    document.getElementById("pkmn" + number + "-item").textContent = itemName;
    document.getElementById("pkmn" + number + "-stage").textContent = stage > 0 ? "+" + stage : stage;
    //badges: visible only when the condition is active
    document.getElementById("pkmn" + number + "-par").hidden = !isParalyzed;
    document.getElementById("pkmn" + number + "-tailwind").hidden = !isTailwind;

    const img = document.getElementById("pkmn" + number + "-img");
    img.src = data.sprites.front_default;
    img.alt = data.name;
    img.hidden = false;
}

/**
 * compares the two speed of the two pokemons, highlight the faster and writes the result
 */
function compareSpeed() {
    //speed are read from teh page, so they are text: Number() converts them
    const speed1 = Number(document.getElementById("pkmn1-speed").textContent);
    const speed2 = Number(document.getElementById("pkmn2-speed").textContent);

    const name1 = document.getElementById("pkmn1-name").textContent;
    const name2 = document.getElementById("pkmn2-name").textContent;

    const result = document.getElementById("result");
    const box1 = document.getElementById("pkmn1-container");
    const box2 = document.getElementById("pkmn2-container");

    //reset box colors
    box1.classList.remove("faster","slower","equal");
    box2.classList.remove("faster","slower","equal");

    //"--" becomes NaN: one of the two pokemon is missing, nothing to compare
    if (isNaN(speed1) || isNaN(speed2)) {
        result.textContent = "";
        return;
    }

    const difference = Math.abs(speed1 - speed2);

    if (speed1 > speed2) {
        box1.classList.add("faster");
        box2.classList.add("slower");
        result.textContent = name1 + " outspeeds " + name2 + " by " + difference + "!";
    } else if (speed2 > speed1) {
        box2.classList.add("faster");
        box1.classList.add("slower");
        result.textContent = name2 + " outspeeds " + name1 + " by " + difference + "!";
    } else {
        box1.classList.add("equal");
        box2.classList.add("equal");
        result.textContent = "Speed tie! Both have " + speed1 + " speed!";
    }

}


/**
 * loads the name of all pokemon from pokeAPI into the <datalist>, so they appear as suggestions
 */
async function loadPokemonList() {
    
    try{
        //limt = 2000, without it, pokeAPI returns only the first 20 pokemon
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
        const data = await response.json();

        const datalist = document.getElementById("pokemon-list");

        for (const pokemon of data.results) {
            const option = document.createElement("option");
            option.value = pokemon.name;
            datalist.appendChild(option);
        }
    } catch (error){
        console.warn("Could not load the pokemon list:", error);
    } 

}

/**
 * updates poth pokemon and then compares them. Called everytime a field changes
 */
async function insertPokemonName() {
    const pkmn1 = input1.value.trim().toLowerCase();
    const pkmn2 = input2.value.trim().toLowerCase();

    await showPokemon(pkmn1, 1);
    await showPokemon(pkmn2, 2);

    compareSpeed();
}

//recalculate every time any field changes
fields.forEach(field => {
    field.addEventListener("change", insertPokemonName);
});

//load the name suggestions once, when the page opens
loadPokemonList();