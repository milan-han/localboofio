# Car Ball - Comprehensive API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Configuration API](#configuration-api)
3. [Game Entities](#game-entities)
4. [Core Game Functions](#core-game-functions)
5. [UI Management](#ui-management)
6. [Player Management](#player-management)
7. [Game Modes](#game-modes)
8. [Effects and Particles](#effects-and-particles)
9. [HTML Elements](#html-elements)
10. [CSS Classes](#css-classes)
11. [Usage Examples](#usage-examples)

## Overview

Car Ball is a browser-based multiplayer car soccer game where players control cars to hit a ball into goals. The game features local play, NPC opponents, drift mechanics, customizable settings, and a retro-styled UI.

### Key Features
- **Multiplayer Support**: Local 2-player, NPC opponents, and planned online multiplayer
- **Game Modes**: Points-based and timed matches
- **Car Customization**: Multiple colors and player names
- **Physics**: Realistic car physics with drift mechanics and friction
- **Visual Effects**: Explosions, tire marks, sparks, and flames
- **Responsive UI**: Retro-styled interface with dynamic elements

---

## Configuration API

### File: `js/config.js`

The configuration module exports constants that control game physics and behavior.

#### FIELD Configuration

```javascript
export const FIELD = {
  MARGIN: 20,        // Distance from canvas edge to field boundary
  GOAL_HEIGHT: 120   // Height of goal openings
};
```

**Usage:**
```javascript
import { FIELD } from './config.js';

// Check if ball is within field bounds
if (ball.x < FIELD.MARGIN) {
  // Ball hit left boundary
}
```

#### CAR Configuration

```javascript
export const CAR = {
  ACCELERATION: 0.1,           // Forward/backward acceleration rate
  MAX_SPEED: 4,               // Maximum car speed
  FRICTION: 0.03,             // General friction applied to car
  TURN_SPEED: 0.05,           // Rate of turning/steering
  FORWARD_FRICTION: 0.02,     // Forward momentum friction
  SIDE_FRICTION_NORMAL: 0.3,  // Side friction during normal driving
  SIDE_FRICTION_BRAKE: 0.03   // Side friction during handbrake (drift)
};
```

**Usage:**
```javascript
import { CAR } from './config.js';

// Create custom car with modified physics
car.acceleration = CAR.ACCELERATION * 1.5; // 50% faster acceleration
```

#### BALL Configuration

```javascript
export const BALL = {
  FRICTION: 0.98  // Ball momentum decay rate (higher = less friction)
};
```

#### COLORS Configuration

```javascript
export const COLORS = {
  PLAYER1: '#c62828',  // Default Player 1 color (red)
  PLAYER2: '#2962ff'   // Default Player 2 color (blue)
};
```

---

## Game Entities

### Ball Class

**File:** `js/entities/Ball.js`

The Ball class represents the soccer ball in the game.

#### Constructor

```javascript
constructor(x, y)
```

**Parameters:**
- `x` (number): Initial X position
- `y` (number): Initial Y position

**Example:**
```javascript
import Ball from './entities/Ball.js';

const ball = new Ball(480, 300); // Center of 960x600 canvas
```

#### Properties

```javascript
ball.x     // X position
ball.y     // Y position
ball.r     // Radius (12 pixels)
ball.vx    // X velocity
ball.vy    // Y velocity
```

#### Methods

##### `update()`
Updates ball physics, applies friction, handles boundary collisions and goal post collisions.

```javascript
ball.update(); // Call each frame
```

##### `draw()`
Renders the ball on the canvas with white fill and black border.

```javascript
ball.draw(); // Call each render frame
```

##### `handleGoalPostCollisions()`
Handles collisions with goal posts, applying strong bounce effects.

```javascript
ball.handleGoalPostCollisions(); // Called automatically by update()
```

### Car Class

**File:** `js/entities/Car.js`

The Car class represents player vehicles with physics, controls, and visual effects.

#### Constructor

```javascript
constructor(x, y, color, controls)
```

**Parameters:**
- `x` (number): Initial X position
- `y` (number): Initial Y position  
- `color` (string): Car color (hex format)
- `controls` (object): Control mapping object

**Example:**
```javascript
import Car from './entities/Car.js';

const playerControls = {
  forward: 'KeyW',
  back: 'KeyS', 
  left: 'KeyA',
  right: 'KeyD',
  brake: 'Space'
};

const car = new Car(100, 300, '#c62828', playerControls);
```

#### Properties

```javascript
// Position and Physics
car.x              // X position
car.y              // Y position
car.heading        // Rotation in radians
car.vx, car.vy     // Velocity components
car.w, car.h       // Width (14) and height (24) for collision

// Physics Parameters
car.acceleration   // Current acceleration rate
car.maxSpeed      // Maximum speed limit
car.friction      // Friction coefficient
car.turnSpeed     // Turning rate
car.gripLevel     // How much car grips vs slides (0-1)

// Visual and Effects
car.color         // Car color
car.driftAmount   // Current drift intensity (0-100)
car.displayRotation // Smooth rotation for UI display
car.currentTurnRate // Current steering input

// State
car.isDestroyed   // Whether car is exploded
car.respawnTimer  // Frames until respawn
car.boostTimer    // Frames of speed boost remaining
car.handbrake     // Handbrake/drift button pressed
```

#### Methods

##### `update()`
Updates car physics, handles input, applies drift mechanics, and manages collisions.

```javascript
car.update(); // Call each frame
```

##### `draw()`
Renders the car with detailed sprite including body, wheels, headlights, and drift effects.

```javascript
car.draw(); // Call each render frame
```

##### `checkTrackBounds()`
Handles boundary collisions and speed reduction on different surfaces.

```javascript
car.checkTrackBounds(); // Called automatically by update()
```

##### `isOnTrack()`
Returns whether the car is on a valid racing surface.

```javascript
if (!car.isOnTrack()) {
  // Apply off-track penalties
}
```

##### `handleGoalPostCollisions()`
Handles collisions between car and goal posts with gentle bouncing.

```javascript
car.handleGoalPostCollisions(); // Called automatically by update()
```

---

## Core Game Functions

### Game State Management

#### `initiateCountdown()`
Starts the match countdown sequence and transitions from setup to gameplay.

```javascript
initiateCountdown();
// - Hides menu UI
// - Positions cars at kickoff locations  
// - Starts 3-2-1-GO countdown
// - Transitions to playing state
```

#### `actuallyStartGame()`
Begins actual gameplay after countdown completes.

```javascript
actuallyStartGame();
// - Sets gameState to "playing"
// - Enables car controls
// - Starts game timer (if timed mode)
// - Initializes NPC if needed
```

#### `returnToTitle()`
Returns to the main menu/setup screen.

```javascript
returnToTitle();
// - Resets all game state
// - Shows menu UI
// - Hides game UI elements
// - Resets scores and positions
```

#### `togglePause()`
Toggles game pause state during gameplay.

```javascript
togglePause();
// Only works during "playing" state
// Shows/hides pause overlay
// Updates pause button appearance
```

### Game Flow

#### `detectGoal()`
Checks if the ball has entered either goal and handles scoring.

```javascript
detectGoal();
// Returns: goal side ("left" or "right") or null
// Automatically updates scores and starts celebration
```

#### `startCelebration(goalSide)`
Initiates goal celebration sequence with effects and slow motion.

**Parameters:**
- `goalSide` (string): "left" or "right"

```javascript
startCelebration("left");
// - Creates explosion at scoring car
// - Starts slow motion effect
// - Shows celebration effects
// - Schedules ball reset
```

#### `checkWinConditions()`
Checks if match should end based on score or time limits.

```javascript
checkWinConditions();
// - Checks points limit (if points mode)
// - Checks time limit (if timed mode)  
// - Calls showGameEndScreen() if match over
```

### Physics and Collisions

#### `handleCarBallCollision(car)`
Handles collision between a car and the ball.

**Parameters:**
- `car` (Car): The car object to check collision with

```javascript
handleCarBallCollision(player);
// - Calculates collision geometry
// - Transfers momentum from car to ball
// - Creates impact effects
```

#### `handleCarCarCollisions()`
Handles collisions between player cars.

```javascript
handleCarCarCollisions();
// - Checks collision between player and player2
// - Creates explosion effects if high-speed impact
// - Bounces cars apart
```

### Ball Management

#### `resetBall()`
Resets ball to center position with zero velocity.

```javascript
resetBall();
// Used after goals and at game start
```

---

## UI Management

### Display Updates

#### `updateUI()`
Updates all UI elements with current game state.

```javascript
updateUI();
// - Updates scoreboard
// - Updates player name displays
// - Updates score colors based on values
// - Calls updateTimerDisplay()
```

#### `updateTimerDisplay()`
Updates the timer display for timed game modes.

```javascript
updateTimerDisplay();
// - Shows countdown timer in timed mode
// - Adds warning colors when time low
// - Switches between 2-column and 3-column layout
```

### Player Cards

#### `drawPlayerCard()`
Renders Player 1's car preview in the player card.

```javascript
drawPlayerCard();
// - Draws car sprite with current color
// - Shows smooth steering animations
// - Updates each frame during setup
```

#### `drawPlayer2Card()`
Renders Player 2's car preview in the player card.

```javascript
drawPlayer2Card();
// - Similar to drawPlayerCard but for player 2
// - Handles NPC difficulty display
// - Shows appropriate car orientation
```

### Chat System

#### `addChatMessage(type, message)`
Adds a message to the chat interface.

**Parameters:**
- `type` (string): Message type ("system", "friend", "self")
- `message` (string): Message content

```javascript
addChatMessage("system", "Welcome to Car Ball!");
addChatMessage("friend", "BuddyBot42: Ready to play?");
addChatMessage("self", "Let's go!");
```

---

## Player Management

### Player Configuration

#### `editPlayerName(playerNum)`
Enables editing mode for a player's name.

**Parameters:**
- `playerNum` (number): 1 or 2

```javascript
editPlayerName(1); // Edit Player 1's name
```

#### `savePlayerName(playerNum)`
Saves the edited player name and updates UI.

**Parameters:**
- `playerNum` (number): 1 or 2

```javascript
savePlayerName(1); // Save Player 1's name
```

#### `selectCarColor(playerNum, color)`
Sets a player's car color and updates all related UI elements.

**Parameters:**
- `playerNum` (number): 1 or 2
- `color` (string): Hex color code

```javascript
selectCarColor(1, '#c62828'); // Set Player 1 to red
selectCarColor(2, '#2962ff'); // Set Player 2 to blue
```

#### `setPlayer2Type(type)`
Sets Player 2 as human or NPC.

**Parameters:**
- `type` (string): "human" or "npc"

```javascript
setPlayer2Type("npc");  // Set Player 2 as NPC
setPlayer2Type("human"); // Set Player 2 as human
```

#### `setNpcDifficulty(level)`
Sets NPC difficulty level (1-10).

**Parameters:**
- `level` (number): Difficulty from 1 (easiest) to 10 (hardest)

```javascript
setNpcDifficulty(5); // Medium difficulty
setNpcDifficulty(10); // Maximum difficulty
```

---

## Game Modes

### Mode Selection

#### `selectMode(mode)`
Switches between different game modes.

**Parameters:**
- `mode` (string): "npc", "friend", or "matchmaking"

```javascript
selectMode("npc");        // Local play mode
selectMode("friend");     // Private room mode
selectMode("matchmaking"); // Public matchmaking
```

### Game Type Configuration

#### `setGameType(type)`
Sets the win condition type.

**Parameters:**
- `type` (string): "points" or "timed"

```javascript
setGameType("points"); // Play until score limit
setGameType("timed");  // Play for time limit
```

#### `setPointsToWin(points)`
Sets the score needed to win in points mode.

**Parameters:**
- `points` (number): 3, 5, 7, or 10

```javascript
setPointsToWin(5); // First to 5 points wins
```

#### `setMatchTime(minutes)`
Sets match duration in timed mode.

**Parameters:**
- `minutes` (number): 2, 5, or 10

```javascript
setMatchTime(5); // 5 minute matches
```

### Multiplayer Functions

#### `createRoom()`
Creates a private room for friend matches.

```javascript
createRoom();
// - Generates room code
// - Shows invite link
// - Switches to friend mode
```

#### `joinRoom()`
Joins a private room using the entered room code.

```javascript
joinRoom();
// - Reads room code from input
// - Attempts to join room
// - Shows connection status
```

#### `findMatch()`
Initiates matchmaking to find online opponents.

```javascript
findMatch();
// - Starts searching for players
// - Shows matchmaking status
// - Handles connection when found
```

---

## Effects and Particles

### Visual Effects

#### `createCarExplosion(x, y, carColor)`
Creates an explosion effect at the specified location.

**Parameters:**
- `x` (number): X position
- `y` (number): Y position  
- `carColor` (string): Color for explosion particles

```javascript
createCarExplosion(car.x, car.y, car.color);
// Creates burst of colored particles
```

#### `createScorchMark(x, y)`
Creates a permanent scorch mark on the ground.

**Parameters:**
- `x` (number): X position
- `y` (number): Y position

```javascript
createScorchMark(explosion.x, explosion.y);
// Adds permanent burn mark to field
```

#### `causeCarExplosion(car)`
Destroys a car and creates explosion effects.

**Parameters:**
- `car` (Car): Car object to explode

```javascript
causeCarExplosion(player);
// - Sets car.isDestroyed = true
// - Creates explosion and scorch mark
// - Sets respawn timer
```

### Particle Systems

#### `updateAllParticles()`
Updates all particle systems (smoke, sparks, flames, tire marks).

```javascript
updateAllParticles();
// Call each frame to animate all effects
```

#### Individual Particle Functions

```javascript
drawSmoke();      // Renders drift smoke
drawTyreMarks();  // Renders tire marks on ground
drawSparks();     // Renders sparks from drifting
drawFlames();     // Renders boost flames
```

### NPC System

#### `npcUpdate(car, ball, customLevel)`
Updates NPC car behavior and AI.

**Parameters:**
- `car` (Car): The NPC car object
- `ball` (Ball): The ball object
- `customLevel` (number, optional): Override difficulty level

```javascript
npcUpdate(player2, ball, 7);
// - Calculates AI decisions
// - Controls car movement
// - Adjusts behavior based on difficulty
```

#### `npcSay(messageArray)`
Makes NPC say a random message from an array.

**Parameters:**
- `messageArray` (Array): Array of possible messages

```javascript
const taunts = ["Too slow!", "Is that all?", "Try harder!"];
npcSay(taunts);
```

---

## HTML Elements

### Game Canvas

```html
<canvas id="game" width="960" height="600"></canvas>
```

The main game canvas where all gameplay is rendered.

### UI Panels

#### Chat Panel
```html
<div class="chat-panel" id="chatPanel">
  <div class="chat-header">LOBBY CHAT</div>
  <div class="chat-messages" id="chatMessages"></div>
  <input type="text" class="chat-input" id="chatInput">
</div>
```

#### Multiplayer Panel
```html
<div class="multiplayer-panel" id="multiplayerPanel">
  <div class="panel-title">GAME MODE</div>
  <div class="mode-selector">
    <button class="mode-btn" onclick="selectMode('npc')">Local</button>
    <button class="mode-btn" onclick="selectMode('friend')">WITH FRIENDS</button>
    <button class="mode-btn active" onclick="selectMode('matchmaking')">MATCHMAKING</button>
  </div>
</div>
```

#### Player Cards
```html
<div class="player-card player-1" id="playerCard">
  <div class="player-card-header" onclick="editPlayerName(1)">PLAYER 1</div>
  <canvas id="playerCardCanvas" width="240" height="160"></canvas>
  <div class="color-selector" id="player1ColorSelector"></div>
</div>
```

### Game Controls

#### Start Button
```html
<div class="start-game-button" id="startGameBtn" onclick="initiateCountdown()">
  START MATCH
</div>
```

#### Game Control Buttons
```html
<button class="back-btn" id="backBtn" onclick="returnToTitle()">BACK</button>
<button class="pause-btn" id="pauseBtn" onclick="togglePause()">⏸</button>
```

### Overlays

#### Countdown Overlay
```html
<div class="countdown-overlay hidden" id="countdownOverlay">
  <div class="countdown-number" id="countdownNumber">3</div>
</div>
```

#### Pause Menu
```html
<div class="pause-overlay hidden" id="pauseOverlay">
  <div class="pause-menu">
    <button onclick="resumeGame()">RESUME</button>
    <button onclick="restartMatch()">RESTART MATCH</button>
    <button onclick="returnToTitle()">BACK TO MENU</button>
  </div>
</div>
```

#### Game End Screen
```html
<div class="game-end-overlay hidden" id="gameEndOverlay">
  <div class="game-end-menu">
    <div class="game-end-title" id="gameEndTitle">WINNER!</div>
    <button onclick="playAgain()">PLAY AGAIN</button>
    <button onclick="returnToTitle()">BACK TO MENU</button>
  </div>
</div>
```

---

## CSS Classes

### Layout Classes

#### Panel States
```css
.hidden           /* Hide elements */
.compressed       /* Compressed chat panel during gameplay */
.field-offset     /* Add margin for game field */
.game-active      /* Active game canvas state */
.zooming          /* Zoom animation for match start */
```

#### UI Components
```css
.chat-panel       /* Chat interface container */
.multiplayer-panel /* Game mode selection panel */
.player-card      /* Player customization card */
.color-selector   /* Color picker interface */
.scoreboard       /* In-game score display */
```

### Button Classes

```css
.mode-btn         /* Game mode selection buttons */
.action-btn       /* Primary action buttons */
.pause-btn        /* Pause/resume button */
.game-end-btn     /* Game end screen buttons */
.difficulty-btn   /* NPC difficulty buttons */
.color-option     /* Color selection circles */
```

### State Classes

```css
.active           /* Active/selected state */
.paused          /* Paused button state */
.visible         /* Visible scoreboard state */
.warning         /* Timer warning color */
.critical        /* Timer critical color */
```

### Animation Classes

```css
.timed-mode      /* 3-column timer layout */
.countdownPulse  /* Countdown number animation */
```

---

## Usage Examples

### Basic Game Setup

```javascript
// Import required modules
import Car from './entities/Car.js';
import Ball from './entities/Ball.js';
import { FIELD, CAR, COLORS } from './config.js';

// Create player controls
const p1Controls = {
  forward: 'KeyW', back: 'KeyS', 
  left: 'KeyA', right: 'KeyD', brake: 'Space'
};
const p2Controls = {
  forward: 'ArrowUp', back: 'ArrowDown',
  left: 'ArrowLeft', right: 'ArrowRight', brake: 'ShiftRight'
};

// Create game objects
const player = new Car(100, 300, COLORS.PLAYER1, p1Controls);
const player2 = new Car(860, 300, COLORS.PLAYER2, p2Controls);
const ball = new Ball(480, 300);

// Game loop
function gameLoop() {
  // Update game objects
  if (gameState === "playing" && !gamePaused) {
    player.update();
    player2.update();
    ball.update();
    
    // Check collisions
    handleCarBallCollision(player);
    handleCarBallCollision(player2);
    handleCarCarCollisions();
    
    // Check for goals
    detectGoal();
    
    // Update particles
    updateAllParticles();
  }
  
  // Render everything
  drawField();
  player.draw();
  player2.draw();
  ball.draw();
  
  requestAnimationFrame(gameLoop);
}
```

### Customizing Game Settings

```javascript
// Set up a 7-point local match against level 8 NPC
selectMode("npc");
setGameType("points");
setPointsToWin(7);
setPlayer2Type("npc");
setNpcDifficulty(8);

// Customize player colors
selectCarColor(1, "#e91e63"); // Pink for Player 1
selectCarColor(2, "#7b1fa2"); // Purple for Player 2

// Start the match
initiateCountdown();
```

### Handling Events

```javascript
// Keyboard input handling
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && gameState === "playing") {
    togglePause();
  }
  if (e.code === "KeyR" && gameState === "playing") {
    restartMatch();
  }
});

// UI button handlers
document.getElementById("startGameBtn").onclick = initiateCountdown;
document.getElementById("backBtn").onclick = returnToTitle;
document.getElementById("pauseBtn").onclick = togglePause;
```

### Creating Custom Effects

```javascript
// Create explosion when cars collide at high speed
function checkHighSpeedCollision(car1, car2) {
  const speed1 = Math.hypot(car1.vx, car1.vy);
  const speed2 = Math.hypot(car2.vx, car2.vy);
  
  if (speed1 > 3 || speed2 > 3) {
    const midX = (car1.x + car2.x) / 2;
    const midY = (car1.y + car2.y) / 2;
    createCarExplosion(midX, midY, car1.color);
    createScorchMark(midX, midY);
  }
}
```

### Modifying Physics

```javascript
// Create a turbo mode with modified physics
function enableTurboMode() {
  // Increase car performance
  player.acceleration = CAR.ACCELERATION * 2;
  player.maxSpeed = CAR.MAX_SPEED * 1.5;
  player2.acceleration = CAR.ACCELERATION * 2;
  player2.maxSpeed = CAR.MAX_SPEED * 1.5;
  
  // Reduce ball friction for faster gameplay
  // Note: Would need to modify Ball class to support this
}
```

### Chat Integration

```javascript
// Add messages based on game events
function onGoalScored(scoringPlayer) {
  if (scoringPlayer === player) {
    addChatMessage("system", "Player 1 scores!");
  } else {
    addChatMessage("system", "Player 2 scores!");
  }
  
  // NPC trash talk
  if (npcMode && scoringPlayer === player2) {
    npcSay(["Too easy!", "Get rekt!", "Is that all you got?"]);
  }
}
```

---

## Integration Notes

### Canvas Context

The game uses a global `ctx` variable for the 2D canvas context. Make sure this is available when calling drawing functions:

```javascript
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
```

### Global Variables

Key global variables used throughout the system:

```javascript
let gameState = "setup";  // "setup", "countdown", "playing", "goal"
let player, player2, ball; // Game entities
let scoreP1 = 0, scoreP2 = 0; // Scores
let gamePaused = false; // Pause state
let npcMode = false; // NPC active flag
```

### Module System

The game uses ES6 modules. Ensure your server supports module loading and use appropriate import/export statements:

```javascript
// Exporting
export default class Car { ... }
export const FIELD = { ... };

// Importing  
import Car from './entities/Car.js';
import { FIELD } from './config.js';
```

This documentation covers all public APIs, functions, and components in the Car Ball game. Each section includes practical examples and usage instructions to help developers understand and extend the game's functionality.