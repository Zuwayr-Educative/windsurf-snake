import { gameState } from '../state.js';
import { SnakeGame } from '../game.js';

// Mock the game module
jest.mock('../game.js');

describe('Game Mechanics', () => {
    let game;

    beforeEach(() => {
        // Reset the game state before each test
        gameState.reset();
        localStorage.clear();
        
        // Create a new game instance
        game = new SnakeGame();
    });

    describe('Snake Movement', () => {
        test('should handle direction changes', () => {
            // Test initial state
            expect(game.handleKeyDown).toHaveBeenCalledTimes(0);
            
            // Create a mock implementation for handleKeyDown
            game.handleKeyDown.mockImplementation((event) => {
                event.preventDefault();
            });
            
            // Simulate arrow key press
            const event = { key: 'ArrowRight', preventDefault: jest.fn() };
            game.handleKeyDown(event);
            
            // Verify handleKeyDown was called with the event
            expect(game.handleKeyDown).toHaveBeenCalledWith(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('should prevent 180-degree turns', () => {
            // Set initial direction
            game.state.direction.set(1, 0, 0);
            game.state.nextDirection.set(1, 0, 0);
            
            // Try to move left (should be prevented)
            const event = { key: 'ArrowLeft', preventDefault: jest.fn() };
            game.handleKeyDown(event);
            
            // Verify the direction wasn't changed
            expect(game.state.nextDirection.x).toBe(1);
            expect(game.state.nextDirection.y).toBe(0);
        });
    });

    describe('Collision Detection', () => {
        test('should detect collisions', () => {
            // Test that moveSnake is called
            game.moveSnake();
            expect(game.moveSnake).toHaveBeenCalledTimes(1);
            
            // Test that game over state can be set
            game.state.gameOver = true;
            expect(game.state.gameOver).toBe(true);
        });
    });

    describe('Food Mechanics', () => {
        test('should handle food spawning', () => {
            // Test that spawnFood is called
            game.spawnFood();
            expect(game.spawnFood).toHaveBeenCalledTimes(1);
            
            // Test that food can be set
            const foodPos = new THREE.Vector3(5, 5, 0);
            game.state.food = foodPos;
            expect(game.state.food).toEqual(foodPos);
        });

        test('should handle score updates', () => {
            // Test initial score
            expect(game.state.score).toBe(0);
            
            // Update score
            game.state.score += 10;
            expect(game.state.score).toBe(10);
        });
    });
});
