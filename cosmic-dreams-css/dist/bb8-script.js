// BB-8 Robot Controller for Cosmic Dreams
class BB8Controller {
    constructor() {
        this.state = {
            droidX: window.innerWidth / 2, // 初始位置设为屏幕中央
            mouseX: window.innerWidth / 2,
            toTheRight: true,
            speed: 2,
            accelMod: 1
        };
        
        this.elements = null;
        this.initialized = false;
        
        // Delay initialization to ensure DOM is ready
        setTimeout(() => this.init(), 100);
    }
    
    init() {
        // Get DOM elements
        this.elements = {
            bb8: document.getElementById('bb8'),
            head: document.getElementById('head'),
            antennas: document.getElementById('antennas'),
            eyes: document.getElementById('eyes'),
            detail: document.getElementById('detail'),
            ball: document.getElementById('ball'),
            speedSlider: document.getElementById('speed-slider'),
            accelSlider: document.getElementById('accel-slider'),
            speedValue: document.getElementById('speed-value'),
            accelValue: document.getElementById('accel-value')
        };
        
        // Check if all elements are found
        const missingElements = [];
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                missingElements.push(key);
            }
        }
        
        if (missingElements.length > 0) {
            console.error('BB-8: Missing DOM elements:', missingElements);
            return;
        }
        
        console.log('BB-8: All elements found, initializing...');
        
        // Update debug status
        const statusEl = document.getElementById('bb8-status');
        if (statusEl) {
            statusEl.textContent = 'Initializing...';
        }
        
        // Set initial position
        this.updatePosition();
        
        // Event listeners
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        if (this.elements.speedSlider) {
            this.elements.speedSlider.addEventListener('input', (e) => this.handleSpeedChange(e));
        }
        
        if (this.elements.accelSlider) {
            this.elements.accelSlider.addEventListener('input', (e) => this.handleAccelChange(e));
        }
        
        // Start movement loop
        this.initialized = true;
        setInterval(() => this.movement(), 16); // ~60fps
        
        console.log('BB-8: Initialization complete');
        
        // Update debug status
        if (statusEl) {
            statusEl.textContent = 'Active';
            statusEl.style.color = '#4CAF50';
        }
    }
    
    handleMouseMove(event) {
        if (!this.initialized) return;
        this.state.mouseX = event.pageX;
    }
    
    handleSpeedChange(e) {
        const value = parseFloat(e.target.value);
        if (value >= 0) {
            this.state.speed = value;
            if (this.elements.speedValue) {
                this.elements.speedValue.textContent = value;
            }
            // Update debug info
            const speedEl = document.getElementById('current-speed');
            if (speedEl) {
                speedEl.textContent = value;
            }
        }
    }
    
    handleAccelChange(e) {
        const value = parseFloat(e.target.value);
        if (value >= 0) {
            this.state.accelMod = value;
            if (this.elements.accelValue) {
                this.elements.accelValue.textContent = value;
            }
            // Update debug info
            const accelEl = document.getElementById('current-accel');
            if (accelEl) {
                accelEl.textContent = value;
            }
        }
    }
    
    movement() {
        if (!this.initialized || !this.elements) return;
        
        const { droidX, mouseX, speed, accelMod } = this.state;
        
        // Calculate if movement is needed
        if (Math.abs(Math.round(droidX) - mouseX) > 2) {
            const distance = mouseX - droidX;
            const acceleration = Math.abs(distance * accelMod) / 100;
            
            let newX = droidX;
            
            // Move to the right
            if (droidX < mouseX) {
                newX = droidX + (speed * acceleration);
                this.state.toTheRight = true;
            }
            // Move to the left
            else {
                newX = droidX - (speed * acceleration);
                this.state.toTheRight = false;
            }
            
            // 边界检查 - 确保BB-8不会移出屏幕
            const minX = 70; // BB-8半宽
            const maxX = window.innerWidth - 70; // 屏幕宽度减去BB-8半宽
            
            this.state.droidX = Math.max(minX, Math.min(maxX, newX));
            
            this.updatePosition();
        }
    }
    
    updatePosition() {
        if (!this.elements || !this.elements.bb8) return;
        
        const { droidX, mouseX, toTheRight } = this.state;
        const mouseDiff = mouseX - droidX;
        
        // Update debug info
        const bb8PosEl = document.getElementById('bb8-pos');
        if (bb8PosEl) {
            bb8PosEl.textContent = Math.round(droidX);
        }
        
        // Update BB-8 position using left property for more reliable positioning
        this.elements.bb8.style.left = `${droidX - 70}px`; // 减去半个宽度来居中
        
        // Control animation state based on movement
        if (Math.abs(mouseDiff) > 10) {
            this.elements.bb8.classList.add('bb8-controlled');
            this.elements.bb8.style.animationPlayState = 'paused';
        } else {
            this.elements.bb8.classList.remove('bb8-controlled');
            this.elements.bb8.style.animationPlayState = 'running';
        }
        
        // Update head position and rotation
        if (this.elements.head) {
            const headTranslateX = mouseDiff / 15;
            const headRotateZ = mouseDiff / 25;
            this.elements.head.style.transform = `translateX(${headTranslateX}px) rotateZ(${headRotateZ}deg)`;
        }
        
        // Update antennas position and rotation
        if (this.elements.antennas) {
            const antennasTranslateX = mouseDiff / 25;
            const antennasRotateZ = mouseDiff / 80;
            this.elements.antennas.style.transform = `translateX(${antennasTranslateX}px) rotateZ(${antennasRotateZ}deg)`;
            this.elements.antennas.className = `antennas ${toTheRight ? 'right' : ''}`;
        }
        
        // Update direction-based classes
        if (this.elements.eyes) {
            this.elements.eyes.className = `eyes ${toTheRight ? 'right' : ''}`;
        }
        
        if (this.elements.detail) {
            this.elements.detail.className = `stripe detail ${toTheRight ? 'right' : ''}`;
        }
        
        // Update ball rotation based on movement
        if (this.elements.ball) {
            const ballRotateZ = droidX / 2;
            this.elements.ball.style.transform = `rotateZ(${ballRotateZ}deg)`;
        }
        
        // Add subtle interactivity glow effect
        if (Math.abs(mouseDiff) > 100) {
            this.elements.bb8.style.filter = `drop-shadow(0 0 1.5vmax rgba(255, 255, 255, 0.6)) brightness(1.1)`;
        } else {
            this.elements.bb8.style.filter = '';
        }
    }
}

// Multiple initialization approaches to ensure BB-8 starts
let bb8Controller = null;

function initBB8() {
    if (bb8Controller) return; // Prevent multiple instances
    
    console.log('Initializing BB-8 Controller...');
    bb8Controller = new BB8Controller();
}

// Try different initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBB8);
} else {
    initBB8();
}

// Fallback initialization after a delay
setTimeout(() => {
    if (!bb8Controller) {
        console.log('BB-8: Fallback initialization');
        initBB8();
    }
}, 1000); 