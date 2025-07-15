# Snake Game

A modern implementation of the classic Snake game built with JavaScript.

Demo: https://zuwayr-educative.github.io/windsurf-snake/

## Project Structure

### Core Files
- `index.html` - The main HTML file that loads the game
- `game.js` - Main game logic and core functionality
- `graphics.js` - Handles all the rendering and visual elements
- `state.js` - Manages the game state

### Configuration
- `package.json` - Project dependencies and scripts
- `babel.config.js` - Babel configuration for JavaScript transpilation
- `setupTests.js` - Test setup configuration

### Assets
- `sounds/` - Directory containing sound effects for the game

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Zuwayr-Educative/windsurf-snake.git
   cd windsurf-snake
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game
Open `index.html` in your web browser to play the game locally.

### Development
To run the development server:
```bash
npm start
```

### Testing
To run tests:
```bash
npm test
```

## Deployment

The game is automatically deployed to GitHub Pages on every push to the `main` branch. The deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy.yml`.

## How to Play
- Use arrow keys to control the snake
- Eat the food to grow longer
- Avoid hitting the walls or yourself
- Try to get the highest score!

## License
This project is open source and available under the [MIT License](LICENSE).

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
