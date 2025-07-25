// Use the global THREE object
const { THREE } = window;

// Game state management
export const gameState = {
    // Snake state
    direction: null,
    nextDirection: null,
    snake: null,
    
    // Game state
    score: 0,
    highScore: 0, // Will be loaded from localStorage
    gameOver: false,
    
    // Food state
    food: null,
    
    // Game settings
    gridSize: 20,
    cellSize: 1,
    moveInterval: 200, // ms
    lastMoveTime: 0,
    
    // Power-up state
    powerUpActive: false,
    powerUpDuration: 10000, // 10 seconds in ms
    powerUpEndTime: 0,
    powerUpCount: 0,
    powerUpThreshold: 0,
    
    // Initialize function to set up Three.js objects
    init: function() {
        this.direction = new THREE.Vector3(1, 0, 0);
        this.nextDirection = new THREE.Vector3(1, 0, 0);
        this.snake = [new THREE.Vector3(0, 0, 0)];
    },
    
    // Reset function to initialize the state
    reset: function() {
        this.direction.set(1, 0, 0);
        this.nextDirection.set(1, 0, 0);
        this.snake = [new THREE.Vector3(0, 0, 0)];
        this.score = 0;
        this.gameOver = false;
        this.food = null;
        this.lastMoveTime = 0;
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
        this.powerUpCount = 0;
        this.powerUpThreshold = Math.floor(Math.random() * 4) + 3; // Random number between 3 and 6
    }
};

// Initialize the game state
gameState.init();

// Load high score from localStorage
gameState.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
