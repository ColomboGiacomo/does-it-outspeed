# Does It Outspeed?

Does It Outspeed is a web application that compares the speed stat of two Pokemon and tells you who is the fastest.

## Features

- Side-by-side comparison: two mirrored panels, one per Pokemon
- Live data: names, sprites and base stats are fetched from PokéAPI
- Actual speed calculation: made using the in-game formula: Speed = floor( ( floor( (2 × Base + IV + floor(EV / 4)) × Level / 100 ) + 5 ) × Nature )
- Automatic updates whenever any field changes
- The fastest pokemon is highlighted in green and the slower in red. In case of a speed tie, both Pokemon are highlighted in yellow.
- Error Handling: misspelled or unknown Pokemon are handled without breaking the page.

## Technologies

- JavaScript
- HTML5
- CSS3
- PokéAPI
- Git
- GitHub
