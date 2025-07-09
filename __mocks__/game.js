// Mock SnakeGame class
class SnakeGame {
    constructor() {
        this.graphicsEngine = {
            updateSnake: jest.fn(),
            updateFood: jest.fn(),
            showGameOver: jest.fn(),
            init: jest.fn()
        };
        this.state = {
            direction: new THREE.Vector3(1, 0, 0),
            nextDirection: new THREE.Vector3(1, 0, 0),
            snake: [new THREE.Vector3(0, 0, 0)],
            score: 0,
            highScore: 0,
            gameOver: false,
            food: null,
            gridSize: 20,
            cellSize: 1,
            moveInterval: 200,
            lastMoveTime: 0,
            reset: jest.fn(),
            init: jest.fn()
        };
        
        // Mock methods
        this.handleKeyDown = jest.fn();
        this.moveSnake = jest.fn();
        this.spawnFood = jest.fn();
        this.resetGame = jest.fn();
    }
}

// Export the mock class as a named export
export { SnakeGame };

// Also export as default for default import
export default { SnakeGame };
