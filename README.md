# Car Ball

This project is a small browser game. Open `index.html` in any modern web browser to start playing.

## How to Play
1. Clone or download this repository.
2. Locate the `index.html` file in the project root.
3. Double–click `index.html` or open it via your browser's **File > Open** menu.
4. The game should load immediately and you can play from the title screen.

## Development
Development mainly happens inside the `js` and `css` folders.

### JavaScript

* `js/config.js` – gameplay constants such as field size and car physics.
* `js/entities/Car.js` and `js/entities/Ball.js` – core game objects.
* `js/main.js` – wires everything together and starts the loop.

### CSS
* `css/style.css` – global layout and UI styling.
* `css/retro-player.css` – styling for the bottom corner video player.

To tweak behaviour, start with `js/config.js` and adjust the exported values.
All modules are ES6 modules so you can import new functionality easily.
When testing in the browser, serve the files over HTTP to avoid module loading issues.

1. Edit the relevant files in `js/` to modify game logic.
2. Edit `css/style.css` to adjust visual styles.
3. For testing changes, run a local HTTP server (for example with `python3 -m http.server`) and navigate to `http://localhost:8000` in your browser. This avoids issues with local file permissions.
4. Refresh the browser to see your changes.

Have fun!
