import { gameState } from '../state.js';

describe('Game State Management', () => {
    beforeEach(() => {
        // Reset the game state before each test
        gameState.reset();
        localStorage.clear();
    });

    test('should initialize with default values', () => {
        expect(gameState.direction).toEqual({ x: 1, y: 0, z: 0 });
        expect(gameState.nextDirection).toEqual({ x: 1, y: 0, z: 0 });
        expect(gameState.snake).toHaveLength(1);
        expect(gameState.snake[0]).toEqual({ x: 0, y: 0, z: 0 });
        expect(gameState.score).toBe(0);
        expect(gameState.gameOver).toBe(false);
        expect(gameState.food).toBeNull();
    });

    test('should reset to initial state', () => {
        // Modify the state
        gameState.direction.set(0, 1, 0);
        gameState.nextDirection.set(0, -1, 0);
        gameState.snake.push(new THREE.Vector3(1, 0, 0));
        gameState.score = 10;
        gameState.gameOver = true;
        gameState.food = new THREE.Vector3(5, 5, 0);

        // Reset and verify
        gameState.reset();
        expect(gameState.direction).toEqual({ x: 1, y: 0, z: 0 });
        expect(gameState.nextDirection).toEqual({ x: 1, y: 0, z: 0 });
        expect(gameState.snake).toHaveLength(1);
        expect(gameState.snake[0]).toEqual({ x: 0, y: 0, z: 0 });
        expect(gameState.score).toBe(0);
        expect(gameState.gameOver).toBe(false);
        expect(gameState.food).toBeNull();
    });

    test('should load high score from localStorage', () => {
        localStorage.setItem('snakeHighScore', '100');
        gameState.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        expect(gameState.highScore).toBe(255);
    });

    test('should handle missing high score in localStorage', () => {
        localStorage.removeItem('snakeHighScore');
        gameState.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        expect(gameState.highScore).toBe(0);
    });
});
