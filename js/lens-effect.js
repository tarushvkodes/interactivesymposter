/**
 * Lens Effect JavaScript
 * This file simulates the effect of different dye concentrations on vision
 */

document.addEventListener('DOMContentLoaded', function() {
    // The lens effect is integrated with the CVD simulation in cvd-simulation.js
    // This file provides additional functions for advanced lens simulations
    
    // Initialize any lens-specific UI elements if needed
    setupLensComparisonDemo();
});

/**
 * Sets up a comparison demonstration of different lens concentrations
 */
function setupLensComparisonDemo() {
    // This function could be expanded in the future to include
    // side-by-side comparisons of different lens concentrations
    
    // For now, we'll enhance the existing simulation with additional information
    
    // Add an information panel about the lens effect for each type of colorblindness
    const simulationContainer = document.querySelector('.cvd-simulator');
    if (!simulationContainer) return;
    
    const infoPanel = document.createElement('div');
    infoPanel.className = 'lens-info-panel';
    infoPanel.style.marginTop = '20px';
    infoPanel.style.padding = '20px 35px'; // Increased padding
    infoPanel.style.backgroundColor = '#e8f4f8';
    infoPanel.style.borderRadius = '5px';
    infoPanel.style.display = 'none'; // Hidden initially
    
    // Create content for the info panel
    infoPanel.innerHTML = `
        <h4>How the Lens Correction Works</h4>
        <p>Our custom 3D printed lenses use specific dye concentrations to enhance color perception:</p>
        <ul class="lens-details" style="list-style-position: outside; margin: 10px 0 10px 20px;">
            <li style="margin-bottom: 8px"><strong>Deuteranomaly (Green-Weak):</strong> Green alcohol dye enhances green perception</li>
            <li style="margin-bottom: 8px"><strong>Protanomaly (Red-Weak):</strong> Red alcohol dye enhances red perception</li>
            <li style="margin-bottom: 8px"><strong>Tritanomaly (Blue-Weak):</strong> Blue alcohol dye enhances blue perception</li>
        </ul>
        <p>The slider demonstrates how different dye concentrations affect color perception. Our research focuses on finding the optimal concentration for each individual's specific CVD type and severity.</p>
        <div class="optimal-range">
            <h4>Typical Optimal Concentration Ranges</h4>
            <div class="concentration-range">
                <span>Deuteranomaly: 15-25%</span>
                <div class="range-bar" id="deuter-range"></div>
            </div>
            <div class="concentration-range">
                <span>Protanomaly: 10-20%</span>
                <div class="range-bar" id="protan-range"></div>
            </div>
            <div class="concentration-range">
                <span>Tritanomaly: 20-30%</span>
                <div class="range-bar" id="tritan-range"></div>
            </div>
        </div>
    `;
    
    // Style the range bars
    infoPanel.querySelector('#deuter-range').style.height = '10px';
    infoPanel.querySelector('#deuter-range').style.width = '100%';
    infoPanel.querySelector('#deuter-range').style.backgroundColor = '#eee';
    infoPanel.querySelector('#deuter-range').style.borderRadius = '5px';
    infoPanel.querySelector('#deuter-range').style.position = 'relative';
    infoPanel.querySelector('#deuter-range').style.marginTop = '5px';
    infoPanel.querySelector('#deuter-range').style.marginBottom = '10px';
    
    const deuterHighlight = document.createElement('div');
    deuterHighlight.style.position = 'absolute';
    deuterHighlight.style.left = '15%';
    deuterHighlight.style.width = '10%'; // This represents 15-25% range
    deuterHighlight.style.height = '100%';
    deuterHighlight.style.backgroundColor = '#2ecc71';
    deuterHighlight.style.borderRadius = '5px';
    infoPanel.querySelector('#deuter-range').appendChild(deuterHighlight);
    
    // Style the other range bars similarly
    infoPanel.querySelector('#protan-range').style.height = '10px';
    infoPanel.querySelector('#protan-range').style.width = '100%';
    infoPanel.querySelector('#protan-range').style.backgroundColor = '#eee';
    infoPanel.querySelector('#protan-range').style.borderRadius = '5px';
    infoPanel.querySelector('#protan-range').style.position = 'relative';
    infoPanel.querySelector('#protan-range').style.marginTop = '5px';
    infoPanel.querySelector('#protan-range').style.marginBottom = '10px';
    
    const protanHighlight = document.createElement('div');
    protanHighlight.style.position = 'absolute';
    protanHighlight.style.left = '10%';
    protanHighlight.style.width = '10%'; // This represents 10-20% range
    protanHighlight.style.height = '100%';
    protanHighlight.style.backgroundColor = '#e74c3c';
    protanHighlight.style.borderRadius = '5px';
    infoPanel.querySelector('#protan-range').appendChild(protanHighlight);
    
    infoPanel.querySelector('#tritan-range').style.height = '10px';
    infoPanel.querySelector('#tritan-range').style.width = '100%';
    infoPanel.querySelector('#tritan-range').style.backgroundColor = '#eee';
    infoPanel.querySelector('#tritan-range').style.borderRadius = '5px';
    infoPanel.querySelector('#tritan-range').style.position = 'relative';
    infoPanel.querySelector('#tritan-range').style.marginTop = '5px';
    infoPanel.querySelector('#tritan-range').style.marginBottom = '10px';
    
    const tritanHighlight = document.createElement('div');
    tritanHighlight.style.position = 'absolute';
    tritanHighlight.style.left = '20%';
    tritanHighlight.style.width = '10%'; // This represents 20-30% range
    tritanHighlight.style.height = '100%';
    tritanHighlight.style.backgroundColor = '#3498db';
    tritanHighlight.style.borderRadius = '5px';
    infoPanel.querySelector('#tritan-range').appendChild(tritanHighlight);
    
    simulationContainer.appendChild(infoPanel);
    
    // Add a toggle button for showing/hiding more information
    const infoButton = document.createElement('button');
    infoButton.textContent = 'Show Lens Information';
    infoButton.style.marginTop = '15px';
    infoButton.style.padding = '8px 15px';
    infoButton.style.backgroundColor = '#3498db';
    infoButton.style.color = 'white';
    infoButton.style.border = 'none';
    infoButton.style.borderRadius = '5px';
    infoButton.style.cursor = 'pointer';
    
    infoButton.addEventListener('click', function() {
        if (infoPanel.style.display === 'none') {
            infoPanel.style.display = 'block';
            this.textContent = 'Hide Lens Information';
        } else {
            infoPanel.style.display = 'none';
            this.textContent = 'Show Lens Information';
        }
    });
    
    simulationContainer.appendChild(infoButton);
    
    // Update the lens strength indicator to show the optimal range
    document.getElementById('lens-strength').addEventListener('input', function() {
        const strengthValue = parseInt(this.value);
        const cvdType = document.getElementById('cvd-type').value;
        
        // Reset all highlights
        deuterHighlight.style.backgroundColor = '#2ecc71';
        protanHighlight.style.backgroundColor = '#e74c3c';
        tritanHighlight.style.backgroundColor = '#3498db';
        
        // Highlight the active range based on selected CVD type
        if (cvdType === 'deuteranomaly') {
            deuterHighlight.style.backgroundColor = '#27ae60';
            // Check if the current strength is in the optimal range
            if (strengthValue >= 15 && strengthValue <= 25) {
                document.getElementById('lens-strength-value').style.color = '#27ae60';
            } else {
                document.getElementById('lens-strength-value').style.color = '';
            }
        } else if (cvdType === 'protanomaly') {
            protanHighlight.style.backgroundColor = '#c0392b';
            if (strengthValue >= 10 && strengthValue <= 20) {
                document.getElementById('lens-strength-value').style.color = '#c0392b';
            } else {
                document.getElementById('lens-strength-value').style.color = '';
            }
        } else if (cvdType === 'tritanomaly') {
            tritanHighlight.style.backgroundColor = '#2980b9';
            if (strengthValue >= 20 && strengthValue <= 30) {
                document.getElementById('lens-strength-value').style.color = '#2980b9';
            } else {
                document.getElementById('lens-strength-value').style.color = '';
            }
        } else {
            document.getElementById('lens-strength-value').style.color = '';
        }
    });
    
    // Update the display when CVD type changes
    document.getElementById('cvd-type').addEventListener('change', function() {
        // Trigger the strength input handler to update styling
        const event = new Event('input');
        document.getElementById('lens-strength').dispatchEvent(event);
    });
}