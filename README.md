# Does It Outspeed?

Does It Outspeed is a web application that compares the Speed stat of two Pokémon and tells you which one is faster.

**Live demo:** [does-it-outspeed.vercel.app](https://does-it-outspeed.vercel.app/)

## Features

- Side-by-side comparison of two Pokémon, with their stats on the sides
- Live data: names, sprites and base stats are fetched from PokéAPI
- Actual Speed calculation using the in-game formula, with natures, EVs, IVs and level
- Speed modifiers: speed stages (−6 to +6), abilities, items (Choice Scarf, Iron Ball), Tailwind and paralysis
- Automatic updates whenever any field changes
- The faster Pokémon is highlighted in green and the slower one in red. In case of a speed tie, both are highlighted in yellow
- Name suggestions while typing
- Error handling for misspelled Pokémon and connection problems
- Responsive layout for phones
- Each Pokémon is fetched only once and cached, to respect PokéAPI's fair use policy

## Technologies

- HTML5
- CSS3
- JavaScript
- PokéAPI
- Vercel
- Git and GitHub

## License

The code is released under the [MIT License](LICENSE). Pokémon names, sprites and related media are not covered by the license.

## Disclaimer

This is an unofficial fan project and portfolio piece, not affiliated with or endorsed by Nintendo, Game Freak or The Pokémon Company. Pokémon data and sprites from [PokéAPI](https://pokeapi.co/).