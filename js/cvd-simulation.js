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
    // Load the initial image
    loadSimulationImage('nature');
    
    // Set up event listeners for controls
    document.getElementById('cvd-type').addEventListener('change', updateSimulation);
    document.getElementById('lens-strength').addEventListener('input', updateLensStrength);
    
    // Set up event listeners for image selection buttons
    const imageButtons = document.querySelectorAll('.image-option');
    imageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageType = this.getAttribute('data-image');
            loadSimulationImage(imageType);
            
            // Update active button styling
            imageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mark the first button as active initially
    if (imageButtons.length > 0) {
        imageButtons[0].classList.add('active');
    }
}

/**
 * Load an image for the simulation
 * @param {string} imageType - Type of image to load (nature, ishihara, traffic, chart)
 */
function loadSimulationImage(imageType) {
    // Define the images
    const images = {
        nature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mandarin_Ducks_Central_Park_crop.jpg/640px-Mandarin_Ducks_Central_Park_crop.jpg',
        ishihara: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ishihara_9.png/640px-Ishihara_9.png',
        traffic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Traffic_lights_4_states.svg/640px-Traffic_lights_4_states.svg.png',
        chart: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Color_star-en.svg/640px-Color_star-en.svg.png'
    };
    
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Allow processing images from other domains
    
    img.onload = function() {
        // Get the canvases
        const originalCanvas = document.getElementById('original-canvas');
        const cvdCanvas = document.getElementById('cvd-canvas');
        const correctedCanvas = document.getElementById('corrected-canvas');
        
        // Resize canvases to match the image aspect ratio
        const aspectRatio = img.width / img.height;
        const canvasHeight = 200; // Fixed height as defined in CSS
        const canvasWidth = Math.round(canvasHeight * aspectRatio);
        
        originalCanvas.width = canvasWidth;
        originalCanvas.height = canvasHeight;
        cvdCanvas.width = canvasWidth;
        cvdCanvas.height = canvasHeight;
        correctedCanvas.width = canvasWidth;
        correctedCanvas.height = canvasHeight;
        
        // Draw the original image
        const origCtx = originalCanvas.getContext('2d');
        origCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        
        // Apply simulations
        updateSimulation();
    };
    
    // Load the selected image
    img.src = images[imageType];
}

/**
 * Updates the lens strength indicator
 */
function updateLensStrength() {
    const strengthValue = document.getElementById('lens-strength').value;
    document.getElementById('lens-strength-value').textContent = strengthValue + '%';
    
    updateSimulation();
}

/**
 * Apply the CVD simulation and lens correction
 */
function updateSimulation() {
    const originalCanvas = document.getElementById('original-canvas');
    const cvdCanvas = document.getElementById('cvd-canvas');
    const correctedCanvas = document.getElementById('corrected-canvas');
    
    // Get selected CVD type
    const cvdType = document.getElementById('cvd-type').value;
    
    // Get lens strength
    const lensStrength = parseInt(document.getElementById('lens-strength').value) / 100;
    
    // Get the image data from the original canvas
    const origCtx = originalCanvas.getContext('2d');
    const imageData = origCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const pixels = imageData.data;
    
    // Create two copies of the image data - one for CVD simulation and one for correction
    const cvdImageData = new ImageData(new Uint8ClampedArray(pixels), imageData.width, imageData.height);
    const correctedImageData = new ImageData(new Uint8ClampedArray(pixels), imageData.width, imageData.height);
    
    // Apply CVD simulation
    simulateCVD(cvdImageData.data, cvdType);
    
    // Apply CVD simulation and lens correction to the corrected image
    simulateCVDWithCorrection(correctedImageData.data, cvdType, lensStrength);
    
    // Draw the simulated images
    const cvdCtx = cvdCanvas.getContext('2d');
    cvdCtx.putImageData(cvdImageData, 0, 0);
    
    const correctedCtx = correctedCanvas.getContext('2d');
    correctedCtx.putImageData(correctedImageData, 0, 0);
}

/**
 * Apply colorblindness simulation to image data
 * @param {Uint8ClampedArray} pixels - The image pixel data
 * @param {string} type - The type of CVD to simulate
 */
function simulateCVD(pixels, type) {
    // If normal vision is selected, don't modify the pixels
    if (type === 'normal') return;
    
    // Simulation matrices for different types of color blindness
    // These matrices transform RGB values to simulate how colors appear to people with CVD
    const matrices = {
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
        ]
    };
    
    // Get the simulation matrix for the selected type
    const matrix = matrices[type];
    
    // Apply the transformation matrix to each pixel
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Matrix multiplication to transform colors
        pixels[i] = r * matrix[0] + g * matrix[1] + b * matrix[2];       // New R
        pixels[i + 1] = r * matrix[3] + g * matrix[4] + b * matrix[5];   // New G
        pixels[i + 2] = r * matrix[6] + g * matrix[7] + b * matrix[8];   // New B
        // Alpha channel (pixels[i + 3]) remains unchanged
    }
}

/**
 * Apply colorblindness simulation with lens correction to image data
 * @param {Uint8ClampedArray} pixels - The image pixel data
 * @param {string} type - The type of CVD to simulate
 * @param {number} lensStrength - The strength of the correction (0-1)
 */
function simulateCVDWithCorrection(pixels, type, lensStrength) {
    // If normal vision is selected or lens strength is 0, just apply the CVD simulation
    if (type === 'normal' || lensStrength === 0) {
        simulateCVD(pixels, type);
        return;
    }
    
    // First copy the pixels to preserve original data
    const originalPixels = new Uint8ClampedArray(pixels);
    
    // Apply the CVD simulation
    simulateCVD(pixels, type);
    
    // Apply lens correction based on the type of CVD
    for (let i = 0; i < pixels.length; i += 4) {
        // Get the original and simulated colors
        const origR = originalPixels[i];
        const origG = originalPixels[i + 1];
        const origB = originalPixels[i + 2];
        
        const simR = pixels[i];
        const simG = pixels[i + 1];
        const simB = pixels[i + 2];
        
        // Calculate the difference between original and simulated colors
        const diffR = origR - simR;
        const diffG = origG - simG;
        const diffB = origB - simB;
        
        // Apply different corrections based on the type of CVD
        switch (type) {
            case 'deuteranomaly': // Green weakness - enhance green
                pixels[i] = Math.max(0, Math.min(255, simR));
                pixels[i + 1] = Math.max(0, Math.min(255, simG + diffG * lensStrength * 1.5));
                pixels[i + 2] = Math.max(0, Math.min(255, simB));
                break;
                
            case 'protanomaly': // Red weakness - enhance red
                pixels[i] = Math.max(0, Math.min(255, simR + diffR * lensStrength * 1.5));
                pixels[i + 1] = Math.max(0, Math.min(255, simG));
                pixels[i + 2] = Math.max(0, Math.min(255, simB));
                break;
                
            case 'tritanomaly': // Blue weakness - enhance blue
                pixels[i] = Math.max(0, Math.min(255, simR));
                pixels[i + 1] = Math.max(0, Math.min(255, simG));
                pixels[i + 2] = Math.max(0, Math.min(255, simB + diffB * lensStrength * 1.5));
                break;
        }
    }
}