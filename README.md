# Does It Outspeed?

A Pokémon Speed calculator: compare two Pokémon and find out which one moves first.

**Live demo: [does-it-outspeed.vercel.app](https://does-it-outspeed.vercel.app/)**

![Screenshot of Does It Outspeed?](screenshot.png)

Pick two Pokémon, set up their level, nature, EVs, IVs, ability, item and battle conditions, and the site calculates each one's actual in-battle Speed using the games' formula. It then shows who is faster, and by how much.

**Lighthouse scores:** 100 Performance · 100 Accessibility · 100 Best Practices · 100 SEO

## Features

### Speed calculation
- **Stats**: level (1–100), nature (+10%, neutral or −10% Speed), EVs (0–252) and IVs (0–31).
- **Speed stages**: from −6 to +6, e.g. after Dragon Dance or Sticky Web.
- **Speed abilities**: ×2 (Chlorophyll, Swift Swim, Sand Rush, Slush Rush, Surge Surfer, Unburden), ×1.5 (Quick Feet, Protosynthesis, Quark Drive) and ×0.5 (Slow Start). Abilities are assumed to be active (e.g. sun for Chlorophyll).
- **Items**: Choice Scarf (×1.5) and Iron Ball (×0.5).
- **Tailwind** (×2) and **paralysis** (×0.5).
- **Special interactions**:
  - Quick Feet ignores the paralysis Speed drop.
  - Unburden works only after the item is consumed, so the item is automatically set to "None".
- **Game-accurate rounding**: every step is rounded down in the same order as in the games, so results match the in-game values.

### Interface
- **Battle card**: the two Pokémon face each other, with their stats on the sides. The faster one is highlighted in green, the slower one in red, and a speed tie in yellow.
- **Live updates**: the result updates automatically whenever any field changes, with no button to press.
- **Name suggestions**: all Pokémon names (including alternate forms such as `charizard-mega-x`) are suggested while typing.
- **Status badges**: PAR and Tailwind badges appear next to the Pokémon's name.
- **Input validation**: out-of-range values (e.g. level 200) are corrected automatically.
- **Error messages**: clear messages for misspelled Pokémon ("Pokemon not found") and missing connection ("Connection error").
- **Responsive layout**: on phones, the battle card becomes a 2×2 grid and the field cards stack vertically.
- **Efficient API usage**: each Pokémon is downloaded only once and kept in memory, so changing its settings (EVs, nature, item...) doesn't call PokéAPI again.

## How Speed is calculated

The site follows the main-series games (Generation VII onward):

1. **Speed stat**, rounded down at each step:
   ```
   floor( ( floor( (2 × Base + IV + floor(EV / 4)) × Level / 100 ) + 5 ) × Nature )
   ```
2. **Speed stage**: ×(2 + stage) / 2 for positive stages, ×2 / (2 − stage) for negative ones.
3. **Modifiers**: ability, item and Tailwind are multiplied together and applied once.
4. **Paralysis**: ×0.5, applied last (ignored with Quick Feet).

**Examples** (level 50, 31 IVs, 252 EVs, Timid nature):

| Pokémon | Conditions | Speed |
|---|---|---|
| Venusaur (base 80) | none | 145 |
| Venusaur | Chlorophyll + Tailwind | 580 |
| Venusaur | Choice Scarf + paralysis | 108 |

## Technologies

- **HTML5**: page structure and form fields (`input`, `select`, `datalist`, checkboxes and radio buttons), with `data-*` attributes to identify special abilities.
- **CSS3**:
  - Flexbox for the page layout and CSS Grid for the mobile battle card
  - CSS custom properties (variables) for colors, sizes and shadows
  - media queries for the responsive layout
- **JavaScript**:
  - `fetch` with `async` / `await` for the API calls
  - `try...catch` for connection errors
  - a `Map` as an in-memory cache
  - event listeners for automatic updates
  - `classList` to highlight the result
- **[PokéAPI](https://pokeapi.co/)**: free REST API for Pokémon data.
- **[Vercel](https://vercel.com/)**: hosting, automatic deploys from GitHub, and cookie-free Web Analytics.

## Getting started

No installation or build step is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/ColomboGiacomo/does-it-outspeed.git
   ```
2. Open `index.html` in your browser.

An internet connection is required to fetch data from PokéAPI.

## Project structure

```
does-it-outspeed/
├── icon/
│   ├── source/
│   │   └── icon.png       → original artwork
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   └── site.webmanifest
├── index.html             → page structure and metadata
├── style.css              → layout, styling and mobile version
├── script.js              → API calls, Speed calculation and comparison
├── screenshot.png         → screenshot used in this README
├── README.md
└── LICENSE
```

## Fair use

This project uses the free public [PokéAPI](https://pokeapi.co/) and follows its fair use policy:

- every Pokémon is requested only once per session and then cached in memory;
- the list of Pokémon names is requested once, when the page opens;
- all requests are made directly from the user's browser.

## License

The code of this project is released under the [MIT License](LICENSE).

This license covers only the source code. Pokémon names, sprites and related media are not covered and remain the property of Nintendo, Game Freak and The Pokémon Company.

## Credits

- Pokémon data and sprites from [PokéAPI](https://pokeapi.co/).
- This is an unofficial fan project and portfolio piece. It is not affiliated with, endorsed, or supported by Nintendo, Game Freak, or The Pokémon Company.
- Pokémon, Pokémon character names and sprites are trademarks and copyrights of Nintendo, Game Freak and The Pokémon Company.
