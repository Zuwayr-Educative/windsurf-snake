import { gameState } from './state.js';
import { graphicsEngine } from './graphics.js';

class SnakeGame {
    constructor() {
        // Import game state
        this.state = gameState;
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        
        // Initialize sounds
        this.initSounds();
        
        // Initialize game state
        this.state.highScore = this.loadHighScore();
        this.state.reset();
        
        // Initialize graphics engine
        graphicsEngine.init('game-container');
        this.spawnFood();
        
        // Initialize UI
        this.gameOverlay = document.getElementById('game-overlay');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalHighScoreElement = document.getElementById('final-high-score');
        document.getElementById('restart-button').addEventListener('click', () => this.resetGame());
        document.getElementById('submit-score').addEventListener('click', () => this.submitScore());
        
        // Display initial high score
        document.getElementById('high-score').textContent = `High Score: ${this.state.highScore}`;
        
        // Start game loop
        this.animate(0);
        
        // Event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    

    
    initSounds() {
        console.log('Initializing sounds...');
        
        // Initialize sound effects with error handling
        this.sounds = {
            eat: new Howl({
                src: ['sounds/eat.mp3'],
                volume: 0.7,
                onload: () => console.log('Eat sound loaded'),
                onloaderror: (id, err) => console.error('Error loading eat sound:', err),
                onplayerror: (id, err) => console.error('Error playing eat sound:', err)
            }),
            gameOver: new Howl({
                src: ['sounds/game-over.mp3'],
                volume: 0.7,
                onload: () => console.log('Game over sound loaded'),
                onloaderror: (id, err) => console.error('Error loading game over sound:', err)
            }),
            powerUp: new Howl({
                src: ['sounds/power-up.mp3'],
                volume: 0.7,
                onload: () => console.log('Power-up sound loaded'),
                onloaderror: (id, err) => console.error('Error loading power-up sound:', err)
            }),
            powerDown: new Howl({
                src: ['sounds/power-down.mp3'],
                volume: 0.7,
                onload: () => console.log('Power-down sound loaded'),
                onloaderror: (id, err) => console.error('Error loading power-down sound:', err)
            }),
            backgroundMusic: new Howl({
                src: ['sounds/background-music.mp3'],
                volume: 0.3,
                loop: true,
                onload: () => {
                    console.log('Background music loaded, attempting to play...');
                    // Try to play, but don't worry if it fails due to autoplay policy
                    this.playBackgroundMusic();
                },
                onloaderror: (id, err) => console.error('Error loading background music:', err),
                onplay: () => console.log('Background music started playing'),
                onplayerror: (id, err) => {
                    console.log('Autoplay prevented, will play after user interaction');
                    // Set up a one-time click handler to start music
                    const playOnInteraction = () => {
                        console.log('User interaction detected, trying to play music...');
                        this.playBackgroundMusic();
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('keydown', playOnInteraction);
                    };
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('keydown', playOnInteraction, { once: true });
                }
            })
        };
    }
    
    playBackgroundMusic() {
        if (!this.sounds || !this.sounds.backgroundMusic) {
            console.log('Background music not initialized yet');
            return;
        }
        
        try {
            // Use a more reliable way to check if sound is already playing
            const soundId = this.sounds.backgroundMusic.play();
            
            // If play() returns a number (sound ID), it means it's playing
            if (typeof soundId === 'number') {
                console.log('Background music started playing with ID:', soundId);
            } else if (soundId && typeof soundId.then === 'function') {
                // Handle promise if returned (for newer browsers)
                soundId.then(() => {
                    console.log('Background music started playing after promise resolution');
                }).catch(err => {
                    console.log('Background music play was prevented:', err);
                });
            }
        } catch (err) {
            // Don't log the error if it's just an autoplay prevention
            if (err && err.name === 'NotAllowedError') {
                console.log('Autoplay was prevented by the browser');
            } else {
                console.error('Error playing background music:', err);
            }
        }
    }
    
    spawnFood() {
        const gridSize = gameState.gridSize;
        let position;
        
        // Keep trying until we find a position not on the snake
        do {
            position = new THREE.Vector3(
                Math.floor(Math.random() * gridSize) - Math.floor(gridSize / 2),
                0,
                Math.floor(Math.random() * gridSize) - Math.floor(gridSize / 2)
            );
        } while (this.state.snake.some(segment => 
            segment.x === position.x && segment.z === position.z
        ));

        gameState.food = { position: position };
        graphicsEngine.renderFood();
    }

    spawnPowerUp() {
        const gridSize = gameState.gridSize;
        let position;
        
        // Keep trying until we find a position not on the snake
        do {
            position = new THREE.Vector3(
                Math.floor(Math.random() * gridSize) - Math.floor(gridSize / 2),
                0,
                Math.floor(Math.random() * gridSize) - Math.floor(gridSize / 2)
            );
        } while (this.state.snake.some(segment => 
            segment.x === position.x && segment.z === position.z
        ));

        gameState.powerUp = { position: position };
        graphicsEngine.updatePowerUp(position);
    }
    
    handleKeyDown(event) {
        // Prevent 180-degree turns
        switch(event.key) {
            // Arrow keys
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.state.direction.z !== 1) this.state.nextDirection.set(0, 0, -1);
                break;
                
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.state.direction.z !== -1) this.state.nextDirection.set(0, 0, 1);
                break;
                
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.state.direction.x !== 1) this.state.nextDirection.set(-1, 0, 0);
                break;
                
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.state.direction.x !== -1) this.state.nextDirection.set(1, 0, 0);
                break;
        }
    }
    
    updateSnake() {
        // Update direction
        this.state.direction.copy(this.state.nextDirection);
        
        // Calculate new head position
        const head = this.state.snake[0].clone();
        head.x += this.state.direction.x;
        head.z += this.state.direction.z;
        
        // Check for collisions with walls
        const halfGrid = this.state.gridSize / 2;
        if (Math.abs(head.x) > halfGrid || Math.abs(head.z) > halfGrid) {
            this.showGameOver();
            return;
        }
        
        // Check for collisions with self
        if (this.state.snake.some(segment => segment.x === head.x && segment.z === head.z)) {
            this.showGameOver();
            return;
        }
        
        // Add new head
        this.state.snake.unshift(head);
        
        // Check for power-up collision
        if (this.state.powerUp && head.x === this.state.powerUp.position.x && head.z === this.state.powerUp.position.z) {
            // Play power-up sound and activate power-up
            this.sounds.powerUp.play();
            this.state.powerUpActive = true;
            this.state.powerUpEndTime = Date.now() + this.state.powerUpDuration;
            graphicsEngine.removePowerUp();
            this.state.powerUp = null;
        }
        
        // Check for food collision
        if (this.state.food && head.x === this.state.food.position.x && head.z === this.state.food.position.z) {
            
            // Spawn new food
            this.sounds.eat.play();
            this.spawnFood();
            graphicsEngine.renderFood();
            
            // Increment power-up counter and spawn power-up if threshold reached
            if (++this.state.powerUpCount >= this.state.powerUpThreshold && !this.state.powerUpActive) {
                this.spawnPowerUp();
                this.state.powerUpThreshold = Math.floor(Math.random() * 4) + 3;
                this.state.powerUpCount = 0;
            }
            
            // Double points during power-up
            const scoreValue = this.state.powerUpActive ? 2 : 1;
            this.state.score += scoreValue;
            document.getElementById('score').textContent = `Score: ${this.state.score}`;
            
            // Increase speed slightly (up to a point)
            if (this.state.moveInterval > 100) {
                this.state.moveInterval -= 5;
            }
        } else {
            // Remove tail if no food was eaten
            this.state.snake.pop();
        }
        
        // Update the snake's visual representation
        graphicsEngine.renderSnake();
    }
    
    update(deltaTime) {
        // Check power-up duration
        if (this.state.powerUpActive && Date.now() >= this.state.powerUpEndTime) {
            // Power-up has ended
            this.state.powerUpActive = false;
            this.sounds.powerDown.play();
            console.log('Power-up ended');
        }

        if (this.state.gameOver) {
            return;
        }
        
        // Move snake at regular intervals
        if (Date.now() - this.state.lastMoveTime > this.state.moveInterval) {
            this.updateSnake();
            this.state.lastMoveTime = Date.now();
        }
    }
    
    loadHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore')) || 0;
    }
    
    saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score);
    }
    
    getHighScores() {
        return JSON.parse(localStorage.getItem('snakeHighScores') || '[]');
    }
    
    saveHighScores(scores) {
        localStorage.setItem('snakeHighScores', JSON.stringify(scores));
    }
    
    async submitScore() {
        const playerName = document.getElementById('player-name').value.trim();
        const scoreMessage = document.getElementById('score-message');
        const submitButton = document.getElementById('submit-score');
        
        if (!playerName) {
            scoreMessage.textContent = 'Please enter your name';
            scoreMessage.style.color = '#ff4444';
            return;
        }
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const scoreData = {
            name: playerName,
            score: this.state.score
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Update UI on success
            submitButton.textContent = 'Score Submitted!';
            scoreMessage.textContent = 'Score submitted to leaderboard successfully!';
            scoreMessage.style.color = '#4caf50';
            
            // Also save to local storage
            const scores = this.getHighScores();
            scores.push({
                ...scoreData,
                date: new Date().toISOString()
            });
            scores.sort((a, b) => b.score - a.score);
            this.saveHighScores(scores.slice(0, 10));
            
        } catch (error) {
            console.error('Error submitting score:', error);
            scoreMessage.textContent = 'Failed to submit score. Please try again.';
            scoreMessage.style.color = '#ff4444';
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Score';
        }
    }
    
    updateHighScore() {
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            this.saveHighScore(this.state.highScore);
            document.getElementById('high-score').textContent = `High Score: ${this.state.highScore}`;
            return true;
        }
        return false;
    }
    
    showGameOver() {
        try {
            console.log('Game over triggered');
            this.state.gameOver = true;
            const isNewHighScore = this.updateHighScore();
            
            console.log('Creating game over screen...');
            
            // Check if document.body exists
            if (!document.body) {
                console.error('document.body is not available');
                return;
            }
            
            // Create and show the new game over screen
            const gameOverScreen = document.createElement('div');
            gameOverScreen.id = 'game-over-screen';
            
            // Add some inline styles as a fallback
            gameOverScreen.style.position = 'fixed';
            gameOverScreen.style.top = '0';
            gameOverScreen.style.left = '0';
            gameOverScreen.style.width = '100%';
            gameOverScreen.style.height = '100%';
            gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            gameOverScreen.style.display = 'flex';
            gameOverScreen.style.justifyContent = 'center';
            gameOverScreen.style.alignItems = 'center';
            gameOverScreen.style.zIndex = '10000';
            
            gameOverScreen.innerHTML = `
                <div class="game-over-container" style="
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
                    padding: 40px;
                    border: 3px solid #e8b450;
                    background-color: #1a1a1a;
                    box-shadow: 0 0 15px rgba(232, 180, 80, 0.2);
                    font-family: 'Press Start 2P', cursive;
                    max-width: 80%;
                    max-height: 90vh;
                    overflow-y: auto;
                    color: #e8b450;
                ">
                    <h1 style="
                        font-size: 4rem;
                        color: #d95b25;
                        text-shadow: 5px 5px 0 #6b280d;
                        margin: 0;
                    ">Game Over</h1>
                    <div class="scores" style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                        width: 100%;
                    ">
                        <p style="margin: 0; font-size: 1.2rem;">Score: ${this.state.score}</p>
                        <p style="margin: 0; font-size: 1.2rem;">High Score: ${this.state.highScore}</p>
                    </div>
                    <div class="form" style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                        width: 100%;
                    ">
                        <label for="playerName" style="margin: 0; font-size: 1.2rem;">Enter Your Name:</label>
                        <input type="text" id="playerName" style="
                            background-color: transparent;
                            border: 3px solid #68a0a8;
                            color: #fff;
                            font-family: 'Press Start 2P', cursive;
                            padding: 10px;
                            text-align: center;
                            width: 80%;
                            font-size: 1rem;
                        ">
                    </div>
                    <div class="buttons" style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 10px;
                        width: 100%;
                    ">
                        <button class="btn btn-submit" id="submit-score" style="
                            background-color: transparent;
                            font-family: 'Press Start 2P', cursive;
                            padding: 15px 25px;
                            border: 3px solid #68a0a8;
                            color: #68a0a8;
                            cursor: pointer;
                            font-size: 1rem;
                            text-transform: uppercase;
                        ">Submit</button>
                        <button class="btn btn-restart" id="restart-button" style="
                            background-color: transparent;
                            font-family: 'Press Start 2P', cursive;
                            padding: 15px 25px;
                            border: 3px solid #d95b25;
                            color: #d95b25;
                            cursor: pointer;
                            font-size: 1rem;
                            text-transform: uppercase;
                        ">Restart</button>
                    </div>
                </div>
            `;
            
            console.log('Game over screen HTML created');
            
            // Add the game over screen to the DOM
            document.body.appendChild(gameOverScreen);
            console.log('Game over screen added to DOM');
            
            // Debug: Check if styles are applied
            const container = document.querySelector('.game-over-container');
            if (container) {
                console.log('Game over container found, checking styles...');
                const styles = window.getComputedStyle(container);
                console.log('Game over container styles:', {
                    display: styles.display,
                    position: styles.position,
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    zIndex: styles.zIndex
                });
            } else {
                console.error('Game over container not found in DOM');
            }
            
            // Use event delegation for button clicks
            document.body.addEventListener('click', (event) => {
                if (event.target.id === 'submit-score') {
                    this.submitScore();
                } else if (event.target.id === 'restart-button') {
                    this.resetGame();
                }
            });
            
        } catch (error) {
            console.error('Error in showGameOver:', error);
        }
        
        // Play game over sound
        try {
            console.log('Attempting to play game over sound');
            this.sounds.gameOver.play();
        } catch (err) {
            console.error('Error playing game over sound:', err);
        }
        
        // Lower background music volume
        try {
            if (this.sounds.backgroundMusic) {
                console.log('Lowering background music volume');
                this.sounds.backgroundMusic.volume(0.1);
            }
        } catch (err) {
            console.error('Error adjusting background music volume:', err);
        }
    }
    
    resetGame() {
        // Remove any existing game over screen and test indicator
        const gameOverScreen = document.getElementById('game-over-screen');
        const testIndicator = document.querySelector('body::after');
        
        if (gameOverScreen) {
            gameOverScreen.remove();
        }
        
        if (testIndicator) {
            testIndicator.remove();
        }
        
        // Reset game state using the state object's reset method
        this.state.reset();
        this.state.highScore = this.loadHighScore();
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('high-score').textContent = `High Score: ${this.state.highScore}`;
        
        // Reset background music volume and try to play again
        if (this.sounds && this.sounds.backgroundMusic) {
            this.sounds.backgroundMusic.volume(0.3);
            this.playBackgroundMusic();
        }
        
        // Clear existing food and spawn new one
        if (this.state.food) {
            graphicsEngine.scene.remove(graphicsEngine.foodMesh);
            this.state.food = null;
        }
        this.spawnFood();
        
        // Reset camera position
        graphicsEngine.camera.position.set(0, 30, 30);
        graphicsEngine.controls.reset();
        
        // Make sure the game is not paused
        if (this.state.paused) {
            this.togglePause();
        }
    }
    

    
    onWindowResize() {
        graphicsEngine.onWindowResize();
    }
    
    animate(time) {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = time - (this.lastFrameTime || 0);
        this.lastFrameTime = time;
        
        if (!this.state.gameOver) {
            this.update(deltaTime);
            graphicsEngine.update(deltaTime);
        }
        
        graphicsEngine.render();
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize the game once
    if (!window.snakeGameInstance) {
        window.snakeGameInstance = new SnakeGame();
    }
});
