// Use the global THREE object and OrbitControls
const { THREE } = window;
const { OrbitControls } = window;

import { gameState } from './state.js';

export class GraphicsEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.snakeMeshes = [];
        this.foodMesh = null;
        this.powerUpMesh = null;
    }

    init(containerId) {
        this.initScene();
        this.initLights();
        this.initCameraAndControls();
        this.createGrid();
        
        // Add the renderer to the DOM
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    initLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
    }

    initCameraAndControls() {
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        // Position camera high above and slightly tilted
        this.camera.position.set(0, 30, 30);
        this.camera.lookAt(0, 0, 0);

        // Add OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2; // Limit to top-down view
        this.controls.target.set(0, 0, 0);
    }

    createGrid() {
        const size = gameState.gridSize;
        const divisions = gameState.gridSize;
        const gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x222222);
        gridHelper.position.y = -0.5; // Slightly below the snake and food
        this.scene.add(gridHelper);
    }

    renderSnake() {
        // Clear existing snake meshes
        this.snakeMeshes.forEach(mesh => {
            this.scene.remove(mesh);
        });
        this.snakeMeshes = [];
        
        // Create new snake meshes
        const geometry = new THREE.BoxGeometry(
            gameState.cellSize * 0.9, 
            gameState.cellSize * 0.9, 
            gameState.cellSize * 0.9
        );
        
        gameState.snake.forEach((segment, index) => {
            const color = index === 0 ? 0x00ff00 : 0x44aa88; // Head is green, body is teal
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(segment);
            cube.userData.type = 'snakeSegment';
            this.scene.add(cube);
            this.snakeMeshes.push(cube);
        });
    }

    renderFood() {
        // Update food position if it exists
        if (gameState.food) {
            if (this.foodMesh) {
                this.foodMesh.position.copy(gameState.food.position);
            } else {
                this.createFoodMesh(gameState.food.position);
            }
        } else {
            // Remove food mesh if food doesn't exist
            if (this.foodMesh) {
                this.scene.remove(this.foodMesh);
                this.foodMesh = null;
            }
        }
    }

    createFoodMesh(position) {
        const geometry = new THREE.SphereGeometry(0.45, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 100
        });
        this.foodMesh = new THREE.Mesh(geometry, material);
        this.foodMesh.position.set(position.x, position.y, position.z);
        this.scene.add(this.foodMesh);
    }

    updateFood(position) {
        if (this.foodMesh) {
            this.foodMesh.position.set(position.x, position.y, position.z);
        } else {
            this.createFoodMesh(position);
        }
    }

    createPowerUpMesh(position) {
        const geometry = new THREE.SphereGeometry(0.45, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0000ff,
            shininess: 100,
            emissive: 0x0000ff,
            emissiveIntensity: 0.5
        });
        this.powerUpMesh = new THREE.Mesh(geometry, material);
        this.powerUpMesh.position.set(position.x, position.y, position.z);
        this.scene.add(this.powerUpMesh);
    }

    updatePowerUp(position) {
        if (this.powerUpMesh) {
            this.powerUpMesh.position.set(position.x, position.y, position.z);
        } else {
            this.createPowerUpMesh(position);
        }
    }

    removePowerUp() {
        if (this.powerUpMesh) {
            this.scene.remove(this.powerUpMesh);
            this.powerUpMesh = null;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    update(deltaTime) {
        if (this.controls) {
            this.controls.update();
        }
    }
}

// Export a singleton instance
export const graphicsEngine = new GraphicsEngine();
