/**
 * CVD Simulation JavaScript
 * This file handles the colorblindness simulation and visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the simulation when page loads
    initCVDSimulation();
});

/**
 * Initialize the CVD simulation interface
 */
function initCVDSimulation() {
    // Set a default CVD type
    document.getElementById('cvd-type').value = 'deuteranomaly';
    
    // Load the initial image with a fade effect
    loadSimulationImage('nature', true);
    
    // Set up event listeners for controls with debouncing
    let debounceTimer;
    document.getElementById('cvd-type').addEventListener('change', function() {
        clearTimeout(debounceTimer);
        fadeOutCanvases();
        debounceTimer = setTimeout(() => {
            processCurrentImage();
        }, 300);
    });
    
    document.getElementById('lens-strength').addEventListener('input', function() {
        const strengthValue = this.value;
        const strengthDisplay = document.getElementById('lens-strength-value');
        
        // Smooth number transition
        animateNumber(
            parseInt(strengthDisplay.textContent), 
            strengthValue,
            (value) => strengthDisplay.textContent = value + '%'
        );
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            processCurrentImage();
        }, 100);
    });
    
    // Enhanced image selection buttons
    const imageButtons = document.querySelectorAll('.image-option');
    imageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageType = this.getAttribute('data-image');
            
            // Smooth button transition
            imageButtons.forEach(btn => {
                btn.style.transition = 'all 0.3s ease';
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            fadeOutCanvases();
            setTimeout(() => {
                loadSimulationImage(imageType);
            }, 300);
        });
    });
    
    // Mark the first button as active initially with animation
    if (imageButtons.length > 0) {
        imageButtons[0].classList.add('active');
    }
}

// Animation helper functions
function fadeOutCanvases() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.style.transition = 'opacity 0.3s ease';
        canvas.style.opacity = '0';
    });
}

function fadeInCanvases() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.style.opacity = '1';
    });
}

function animateNumber(start, end, callback) {
    const duration = 300;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOutCubic);
        
        callback(current);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

/**
 * Get the currently selected image type
 */
function getCurrentImage() {
    const activeButton = document.querySelector('.image-option.active');
    return activeButton ? activeButton.getAttribute('data-image') : 'nature';
}

/**
 * Process the currently displayed image with the selected effects
 */
function processCurrentImage() {
    loadSimulationImage(getCurrentImage());
}

/**
 * Load an image for the simulation
 * @param {string} imageType - Type of image to load (nature, ishihara, traffic, chart)
 */
function loadSimulationImage(imageType) {
    const images = {
        nature: './images/nature.jpg',
        ishihara: './images/ishihara.png',
        traffic: './images/trafficlight.jpg',
        chart: './images/colorwheel.png'
    };
    
    console.log("Starting to load image:", images[imageType]);
    
    // Create new image and wait for it to load
    const img = new Image();
    
    // Show loading state with dimensions feedback
    const canvases = ['original-canvas', 'cvd-canvas', 'corrected-canvas'];
    canvases.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            console.log(`Canvas ${id} dimensions:`, canvas.width, 'x', canvas.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '14px Arial';
            ctx.fillText('Loading...', canvas.width/2, canvas.height/2);
        } else {
            console.error(`Canvas ${id} not found`);
        }
    });

    // Wait for image to load
    img.onload = function() {
        console.log("Image loaded successfully:", imageType);
        console.log("Image natural dimensions:", img.naturalWidth, "x", img.naturalHeight);
        
        // Draw image immediately to test if it's loaded correctly
        const testCanvas = document.createElement('canvas');
        testCanvas.width = img.naturalWidth;
        testCanvas.height = img.naturalHeight;
        const testCtx = testCanvas.getContext('2d');
        testCtx.drawImage(img, 0, 0);
        
        try {
            // Test if we can get image data (this will fail if CORS is blocking)
            testCtx.getImageData(0, 0, 1, 1);
            processLoadedImage(img);
        } catch (e) {
            console.error('CORS error when accessing image data:', e);
            // Try without crossOrigin as a fallback
            const retryImg = new Image();
            retryImg.onload = function() {
                processLoadedImage(retryImg);
            };
            retryImg.src = img.src;
        }
    };
    
    img.onerror = function(e) {
        console.error('Failed to load image:', imageType, images[imageType], e);
        
        // Show error state in canvases
        canvases.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fee';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#c00';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '14px Arial';
                ctx.fillText('Error loading image', canvas.width/2, canvas.height/2);
                ctx.font = '12px Arial';
                ctx.fillText('Please check console for details', canvas.width/2, canvas.height/2 + 20);
            }
        });
    };
    
    // Force initial canvas setup with explicit dimensions
    canvases.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            canvas.width = 400;
            canvas.height = 300;
            canvas.style.width = '400px';
            canvas.style.height = '300px';
        }
    });

    // Load the image with crossOrigin setting for first attempt
    img.crossOrigin = "anonymous";
    img.src = images[imageType];
    
    // Force a reload if the image is cached
    if (img.complete) {
        img.onload();
    }
}

/**
 * Process a loaded image with CVD simulation and lens effects
 * @param {Image} img - The loaded image object
 */
function processLoadedImage(img) {
    const canvases = ['original-canvas', 'cvd-canvas', 'corrected-canvas'];
    const displayWidth = 400;
    const displayHeight = 300;
    
    // Set up canvases with initial opacity 0
    canvases.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 0.3s ease';
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    });

    // Process images with a slight delay for smooth transition
    setTimeout(() => {
        try {
            // Process original canvas
            const originalCanvas = document.getElementById('original-canvas');
            const origCtx = originalCanvas.getContext('2d');
            origCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
            
            // Process CVD simulation
            const cvdCanvas = document.getElementById('cvd-canvas');
            const cvdCtx = cvdCanvas.getContext('2d');
            cvdCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
            const cvdImageData = cvdCtx.getImageData(0, 0, displayWidth, displayHeight);
            
            const cvdType = document.getElementById('cvd-type').value;
            const cvdMatrix = getCVDMatrix(cvdType);
            applyColorMatrix(cvdImageData.data, cvdMatrix);
            cvdCtx.putImageData(cvdImageData, 0, 0);
            
            // Process corrected view
            const correctedCanvas = document.getElementById('corrected-canvas');
            const corrCtx = correctedCanvas.getContext('2d');
            corrCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
            const correctedImageData = corrCtx.getImageData(0, 0, displayWidth, displayHeight);
            
            // Apply corrections
            const lensStrength = parseInt(document.getElementById('lens-strength').value) / 100;
            if (lensStrength > 0 && cvdType !== 'normal') {
                const origImageData = origCtx.getImageData(0, 0, displayWidth, displayHeight);
                applyLensCorrection(origImageData.data, correctedImageData.data, lensStrength, cvdType);
            } else {
                applyColorMatrix(correctedImageData.data, cvdMatrix);
            }
            
            corrCtx.putImageData(correctedImageData, 0, 0);
            
            // Fade in all canvases
            fadeInCanvases();
            
        } catch (error) {
            console.error('Error processing image:', error);
        }
    }, 300);
}

/**
 * Apply lens correction to image data
 * @param {Uint8ClampedArray} origData - Original image data
 * @param {Uint8ClampedArray} corrData - Data to apply correction to
 * @param {number} strength - Strength of correction (0-1)
 * @param {string} cvdType - Type of color vision deficiency
 */
function applyLensCorrection(origData, corrData, strength, cvdType) {
    const length = corrData.length;
    
    // Use a more efficient approach with fewer branches inside the loop
    for (let i = 0; i < length; i += 4) {
        const origR = origData[i];
        const origG = origData[i + 1];
        const origB = origData[i + 2];
        
        const simulatedR = corrData[i];
        const simulatedG = corrData[i + 1];
        const simulatedB = corrData[i + 2];
        
        // Calculate color differences
        const diffR = origR - simulatedR;
        const diffG = origG - simulatedG;
        const diffB = origB - simulatedB;
        
        // Apply lens correction based on CVD type
        const enhancedStrength = strength * 2;
        
        if (cvdType === 'deuteranomaly') { // Green deficiency
            corrData[i + 1] = clamp(simulatedG + diffG * enhancedStrength);
        } else if (cvdType === 'protanomaly') { // Red deficiency
            corrData[i] = clamp(simulatedR + diffR * enhancedStrength);
        } else if (cvdType === 'tritanomaly') { // Blue deficiency
            corrData[i + 2] = clamp(simulatedB + diffB * enhancedStrength);
        }
    }
}

/**
 * Clamp a value between 0 and 255
 */
function clamp(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * Get the appropriate color transformation matrix for a CVD type
 */
function getCVDMatrix(cvdType) {
    const matrices = {
        // More pronounced effects for better visualization
        deuteranomaly: [ // Green-weak
            0.80, 0.20, 0.00,
            0.25, 0.75, 0.00,
            0.00, 0.30, 0.70
        ],
        protanomaly: [ // Red-weak
            0.75, 0.25, 0.00,
            0.30, 0.70, 0.00,
            0.00, 0.30, 0.70
        ],
        tritanomaly: [ // Blue-weak
            0.95, 0.05, 0.00,
            0.00, 0.85, 0.15,
            0.00, 0.10, 0.90
        ],
        normal: [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]
    };
    
    return matrices[cvdType] || matrices.normal;
}

/**
 * Apply a color transformation matrix to image data
 */
function applyColorMatrix(pixels, matrix) {
    const length = pixels.length;
    
    for (let i = 0; i < length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        pixels[i] = clamp(r * matrix[0] + g * matrix[1] + b * matrix[2]);
        pixels[i + 1] = clamp(r * matrix[3] + g * matrix[4] + b * matrix[5]);
        pixels[i + 2] = clamp(r * matrix[6] + g * matrix[7] + b * matrix[8]);
        // Alpha remains unchanged
    }
}