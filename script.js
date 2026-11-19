const input1 = document.getElementById("pkmn1");
const input2 = document.getElementById("pkmn2");

//limits the value of levels, evs, ivs
function limitNumber(id){
    const field = document.getElementById(id);

    const min = Number(field.min);
    const max = Number(field.max);

    let value = Number(field.value);

    //campo vuoto o non valido
    if(isNaN(value) || field.value === ""){
        value = Number(field.defaultValue);
    }
    
    value = Math.min(Math.max(value, min), max); //blocco tra min e max
    value = Math.floor(value);  //niente decimali (se 30.8 -> 30)
      
    field.value = value; //corregge quello che si vede nel campo

    return value;
}

// Calcola la velocità reale con la formula dei giochi
function calculateSpeed(baseSpeed, level, evs, ivs, nature, ability, par, tailwind, item, stage) {

    console.log({baseSpeed, level, evs, ivs, nature, ability, par, tailwind, item, stage});
    console.log("---------------------------------------------------------------");

    const step1 = Math.floor((2 * baseSpeed + ivs + Math.floor(evs / 4)) * level / 100);
    const step2 = step1 + 5;
    const step3 = Math.floor(step2 * nature); 
    const step4 = applyStage(step3, stage);    
    
    const modifier = ability * tailwind * item;

    const step5 = Math.floor(step4 * modifier);

    const finalSpeed = Math.floor(step5 * par);

    return finalSpeed;
}

//search pokemon and write data in box
async function showPokemon(name, number){
    if(name === "") return;
    
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);

    if(!response.ok){
        document.getElementById("pkmn" + number + "-name").textContent = "";
        document.getElementById("pkmn" + number + "-speed").textContent = "--";
        document.getElementById("pkmn" + number + "-img").hidden = true;
        document.getElementById("pkmn" + number + "-par").hidden = true;
        document.getElementById("pkmn" + number + "-tailwind").hidden = true;
        return;
    }

    const data = await response.json();
    
    //const baseSpeed = data.stats.find(s => s.stat.name === "speed").base_stat; //questo è come il for ma in una riga
    let baseSpeed;
    for(const s of data.stats){
        if(s.stat.name === "speed"){
            baseSpeed = s.base_stat;
        }
    }

    const level = limitNumber("level" + number);
    const evs = limitNumber("EVs" + number);
    const ivs = limitNumber("IVs" + number);
    
    const natureSelect = document.getElementById("nature" + number);
    const nature = Number(natureSelect.value); //1.1, 0.9, 1
    const natureName = natureSelect.options[natureSelect.selectedIndex].text; //timid, calm, jolly ...

    const abilitySelect = document.getElementById("ability" + number);
    const ability = Number(abilitySelect.value);
    const abilityName = abilitySelect.options[abilitySelect.selectedIndex].text;

    const isParalyzed = document.getElementById("parpkmn"+number).checked;
    const abilityId = abilitySelect.options[abilitySelect.selectedIndex].dataset.ability;

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
    const itemName = document.querySelector('label[for="' + itemRadio.id + '"]').textContent;

    const stage = Number(document.getElementById("stage" + number).value);

    const speed = calculateSpeed(baseSpeed, level, evs, ivs, nature, ability, par, tailwind, item, stage);

    document.getElementById("pkmn" + number + "-name").textContent = data.name;
    document.getElementById("pkmn" + number + "-level").textContent = level;
    document.getElementById("pkmn" + number + "-nature").textContent = natureName;
    document.getElementById("pkmn" + number + "-EVs").textContent = evs;
    document.getElementById("pkmn" + number + "-IVs").textContent = ivs;
    document.getElementById("pkmn" + number + "-speed").textContent = speed;
    document.getElementById("pkmn" + number + "-ability").textContent = abilityName;
    document.getElementById("pkmn" + number + "-par").hidden = !isParalyzed;
    document.getElementById("pkmn" + number + "-tailwind").hidden = !isTailwind;
    document.getElementById("pkmn" + number + "-item").textContent = itemName;
    document.getElementById("pkmn" + number + "-stage").textContent = stage > 0 ? "+" + stage : stage;


    const img = document.getElementById("pkmn" + number + "-img");
    img.src = data.sprites.front_default;
    img.alt = data.name;
    img.hidden = false;
}

function compareSpeed() {
    //estraggo i valori di velocità e nomi dei Pokémon
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

    //controllo se i valori di velocità sono numeri validi
    if (isNaN(speed1) || isNaN(speed2)) {
        result.textContent = "";
        return;
    }

    //confronto le velocità e aggiorno il risultato e i colori delle box
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

function applyStage(stat, stage){
    if(stage >= 0){
        return Math.floor(stat * (2 + stage) / 2);
    }
    else{
        return Math.floor(stat * 2 / (2 - stage));
    }
}

async function insertPokemonName() {
    const pkmn1 = input1.value.trim().toLowerCase();
    const pkmn2 = input2.value.trim().toLowerCase();

    await showPokemon(pkmn1, 1);
    await showPokemon(pkmn2, 2);

    compareSpeed();
}

const fields = document.querySelectorAll(".search-container input, .search-container select");

fields.forEach(field => {
    field.addEventListener("change", insertPokemonName);
});
  