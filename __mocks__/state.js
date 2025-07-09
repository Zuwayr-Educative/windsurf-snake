const createTestState = () => ({
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
    
    reset: function() {
        this.direction.set(1, 0, 0);
        this.nextDirection.set(1, 0, 0);
        this.snake = [new THREE.Vector3(0, 0, 0)];
        this.score = 0;
        this.gameOver = false;
        this.food = null;
    },
    
    init: function() {
        this.reset();
    }
});

const mockState = createTestState();

export const gameState = mockState;
