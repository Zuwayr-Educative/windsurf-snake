// Mock THREE.js
global.THREE = {
    Vector3: class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        set(x, y, z) {
            this.x = x;
            this.y = y !== undefined ? y : this.y;
            this.z = z !== undefined ? z : this.z;
            return this;
        }
        
        equals(v) {
            return this.x === v.x && this.y === v.y && this.z === v.z;
        }
        
        copy(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }
    }
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = String(value);
        },
        clear: () => {
            store = {};
        },
        removeItem: (key) => {
            delete store[key];
        }
    };
})();

global.localStorage = localStorageMock;

// Mock Howl
class Howl {
    constructor(options) {
        this.options = options;
        this.volume = options.volume || 1;
    }
    
    play() {}
    stop() {}
}

global.Howl = Howl;
