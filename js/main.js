/**
 * Main JavaScript file for the Interactive Symposium Poster
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Set up the expected results chart
    setupExpectedResultsChart();
    
    // Initialize 3D model viewer
    setupModelViewer();

    // Setup interactive Ishihara test example
    setupIshiharaExample();
    
    // Setup FM100 test example
    setupFM100Example();
});

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.poster-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Sets up the chart for expected results visualization
 */
function setupExpectedResultsChart() {
    const chartContainer = document.getElementById('expected-results-chart');
    
    if (!chartContainer) return;
    
    // Clear placeholder content
    chartContainer.textContent = '';
    
    // Create a simple bar chart using HTML/CSS
    const concentrations = [0, 5, 10, 15, 20, 25, 30];
    const expectedScores = [65, 60, 52, 35, 20, 28, 42]; // Higher is worse
    const maxScore = Math.max(...expectedScores);
    
    const chartTitle = document.createElement('h4');
    chartTitle.textContent = 'Expected Improvement in Test Scores with Different Dye Concentrations (%)';
    chartContainer.appendChild(chartTitle);
    
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    chartWrapper.style.display = 'flex';
    chartWrapper.style.height = '220px';
    chartWrapper.style.alignItems = 'flex-end';
    chartWrapper.style.gap = '10px';
    chartWrapper.style.paddingTop = '20px';
    chartWrapper.style.position = 'relative';
    
    // Add y-axis label
    const yAxisLabel = document.createElement('div');
    yAxisLabel.style.position = 'absolute';
    yAxisLabel.style.transform = 'rotate(-90deg)';
    yAxisLabel.style.left = '-35px';
    yAxisLabel.style.top = '50%';
    yAxisLabel.textContent = 'Error Score';
    chartWrapper.appendChild(yAxisLabel);
    
    // Add horizontal lines for reference
    for (let i = 0; i <= 4; i++) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.left = '30px';
        line.style.right = '10px';
        line.style.top = `${20 + (i * 50)}px`;
        line.style.borderBottom = '1px dashed #ccc';
        
        const label = document.createElement('span');
        label.style.position = 'absolute';
        label.style.left = '-25px';
        label.style.top = '-10px';
        label.textContent = `${Math.round((4 - i) * (maxScore / 4))}`;
        line.appendChild(label);
        
        chartWrapper.appendChild(line);
    }
    
    // Create bars for the chart
    concentrations.forEach((conc, index) => {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.flex = '1';
        
        const bar = document.createElement('div');
        const heightPercentage = (expectedScores[index] / maxScore) * 100;
        bar.style.width = '80%';
        bar.style.height = `${heightPercentage}%`;
        bar.style.backgroundColor = '#3498db';
        bar.style.borderRadius = '3px 3px 0 0';
        
        // Add value on top of the bar
        const value = document.createElement('div');
        value.textContent = expectedScores[index];
        value.style.marginBottom = '5px';
        value.style.fontWeight = 'bold';
        value.style.fontSize = '12px';
        
        // Add concentration label below the bar
        const label = document.createElement('div');
        label.textContent = `${conc}%`;
        label.style.marginTop = '5px';
        label.style.fontSize = '12px';
        
        // Create optimal marker for the best concentration
        if (expectedScores[index] === Math.min(...expectedScores)) {
            bar.style.backgroundColor = '#e74c3c';
            const optimal = document.createElement('div');
            optimal.textContent = 'Optimal';
            optimal.style.fontSize = '10px';
            optimal.style.fontWeight = 'bold';
            optimal.style.color = '#e74c3c';
            optimal.style.marginTop = '3px';
            barContainer.appendChild(optimal);
        }
        
        barContainer.appendChild(value);
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartWrapper.appendChild(barContainer);
    });
    
    chartContainer.appendChild(chartWrapper);
    
    // Add x-axis label
    const xAxisLabel = document.createElement('div');
    xAxisLabel.style.textAlign = 'center';
    xAxisLabel.style.marginTop = '20px';
    xAxisLabel.textContent = 'Dye Concentration (%)';
    chartContainer.appendChild(xAxisLabel);
    
    // Add caption
    const caption = document.createElement('p');
    caption.style.fontSize = '0.8rem';
    caption.style.marginTop = '10px';
    caption.style.fontStyle = 'italic';
    caption.style.textAlign = 'center';
    caption.textContent = 'Lower score indicates better color discrimination';
    chartContainer.appendChild(caption);
}

/**
 * Sets up the 3D model viewer for the lens design
 */
function setupModelViewer() {
    const modelContainer = document.getElementById('lens-model-container');
    
    if (!modelContainer || !window.THREE) return;
    
    // Clear placeholder
    modelContainer.textContent = '';
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    modelContainer.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple lens geometry
    const geometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        roughness: 0.5,
        metalness: 0.1,
        reflectivity: 0.5,
        transmission: 0.6
    });
    
    const lens = new THREE.Mesh(geometry, material);
    lens.rotation.x = Math.PI / 2;
    scene.add(lens);
    
    // Add a frame for the glasses
    const frameGeometry = new THREE.TorusGeometry(2.1, 0.1, 16, 100);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.rotation.x = Math.PI / 2;
    scene.add(frame);
    
    // Add interaction - rotation on mouse move
    modelContainer.addEventListener('mousemove', (event) => {
        const rect = modelContainer.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / modelContainer.clientWidth) * 2 - 1;
        const y = -(((event.clientY - rect.top) / modelContainer.clientHeight) * 2 - 1);
        
        lens.rotation.y = x * 2;
        lens.rotation.z = y;
        frame.rotation.y = x * 2;
        frame.rotation.z = y;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        lens.rotation.y += 0.001;
        frame.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    });
    
    // Add labels
    const labelContainer = document.createElement('div');
    labelContainer.style.textAlign = 'center';
    labelContainer.style.marginTop = '10px';
    
    const label = document.createElement('p');
    label.textContent = 'Interactive 3D model of the proposed lens design';
    label.style.fontStyle = 'italic';
    labelContainer.appendChild(label);
    
    const instruction = document.createElement('p');
    instruction.textContent = 'Mouse over to rotate the model';
    instruction.style.fontSize = '12px';
    labelContainer.appendChild(instruction);
    
    modelContainer.appendChild(labelContainer);
}

/**
 * Sets up the Ishihara test example
 */
function setupIshiharaExample() {
    const container = document.getElementById('ishihara-container');
    if (!container) return;
    
    // Replace placeholder with an SVG representation of an Ishihara plate
    container.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '250');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.style.backgroundColor = '#f5e5b8';
    svg.style.borderRadius = '50%';
    
    // Generate dots
    const colors = [
        '#7da877', // background dots (green)
        '#ea9273'  // number dots (red-orange)
    ];
    
    // Arrays of points that form the number 74
    const numberPoints = [
        // 7
        [150, 100], [170, 100], [190, 100], [210, 100], [220, 120], [215, 140], [210, 160],
        [205, 180], [200, 200], [195, 220], [190, 240], [185, 260], [180, 280], [175, 300],
        // 4
        [270, 100], [260, 130], [250, 160], [240, 190], [230, 220], [220, 250],
        [240, 250], [260, 250], [280, 250], [300, 250],
        [270, 130], [270, 160], [270, 190], [270, 220], [270, 280], [270, 310]
    ];
    
    // Generate background dots
    for (let i = 0; i < 1500; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        // Random position within circular boundary
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 190;
        const x = 200 + radius * Math.cos(angle);
        const y = 200 + radius * Math.sin(angle);
        
        const inNumber = numberPoints.some(point => {
            const dx = point[0] - x;
            const dy = point[1] - y;
            return Math.sqrt(dx * dx + dy * dy) < 15;
        });
        
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', Math.random() * 5 + 3);
        
        // Choose color based on whether it's part of the number
        circle.setAttribute('fill', inNumber ? colors[1] : colors[0]);
        
        svg.appendChild(circle);
    }
    
    container.appendChild(svg);
    
    // Add caption
    const caption = document.createElement('p');
    caption.textContent = 'Sample plate from an Ishihara test (people with deuteranomaly may have difficulty seeing the number "74")';
    container.appendChild(caption);
    
    // Add an interactive element - toggle between normal and deuteranomaly vision
    const button = document.createElement('button');
    button.textContent = 'Simulate Deuteranomaly View';
    button.style.marginTop = '10px';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '5px';
    button.style.border = '1px solid #ccc';
    button.style.backgroundColor = '#f0f0f0';
    button.style.cursor = 'pointer';
    
    let isDeuteranomaly = false;
    button.addEventListener('click', () => {
        isDeuteranomaly = !isDeuteranomaly;
        button.textContent = isDeuteranomaly ? 'Normal View' : 'Simulate Deuteranomaly View';
        
        // Change colors to simulate deuteranomaly
        const circles = svg.querySelectorAll('circle');
        circles.forEach(circle => {
            if (isDeuteranomaly) {
                if (circle.getAttribute('fill') === colors[1]) {
                    circle.setAttribute('fill', '#ba9f7e'); // Red appears more brown
                } else {
                    circle.setAttribute('fill', '#baa87c'); // Green appears more brownish-yellow
                }
            } else {
                const inNumber = numberPoints.some(point => {
                    const dx = point[0] - parseFloat(circle.getAttribute('cx'));
                    const dy = point[1] - parseFloat(circle.getAttribute('cy'));
                    return Math.sqrt(dx * dx + dy * dy) < 15;
                });
                circle.setAttribute('fill', inNumber ? colors[1] : colors[0]);
            }
        });
    });
    
    container.appendChild(button);
}

/**
 * Sets up the FM100 test example
 */
function setupFM100Example() {
    const container = document.getElementById('fm100-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create FM100 test representation
    const fm100Div = document.createElement('div');
    fm100Div.style.width = '100%';
    fm100Div.style.height = '180px';
    fm100Div.style.display = 'flex';
    fm100Div.style.flexWrap = 'wrap';
    fm100Div.style.gap = '2px';
    fm100Div.style.justifyContent = 'center';
    fm100Div.style.alignContent = 'center';
    fm100Div.style.backgroundColor = '#f5f5f5';
    fm100Div.style.borderRadius = '5px';
    fm100Div.style.padding = '10px';
    
    // Generate color blocks (just a sample, not the full 100)
    const colors = [
        // Reds to yellows
        '#FF0000', '#FF1A00', '#FF3300', '#FF4D00', '#FF6600',
        '#FF8000', '#FF9900', '#FFB300', '#FFCC00', '#FFE600',
        // Yellows to greens
        '#FFFF00', '#E6FF00', '#CCFF00', '#B2FF00', '#99FF00',
        '#80FF00', '#66FF00', '#4DFF00', '#33FF00', '#1AFF00',
        // Greens to cyans
        '#00FF00', '#00FF1A', '#00FF33', '#00FF4D', '#00FF66',
        '#00FF80', '#00FF99', '#00FFB3', '#00FFCC', '#00FFE6',
        // Cyans to blues
        '#00FFFF', '#00E6FF', '#00CCFF', '#00B3FF', '#0099FF',
        '#0080FF', '#0066FF', '#004DFF', '#0033FF', '#001AFF',
        // Blues to purples
        '#0000FF', '#1A00FF', '#3300FF', '#4D00FF', '#6600FF',
        '#8000FF', '#9900FF', '#B300FF', '#CC00FF', '#E600FF',
        // Purples to reds
        '#FF00FF', '#FF00E6', '#FF00CC', '#FF00B3', '#FF0099',
        '#FF0080', '#FF0066', '#FF004D', '#FF0033', '#FF001A'
    ];
    
    // Shuffle the colors to simulate an unsolved test
    const shuffled = [...colors];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Create color blocks
    shuffled.forEach(color => {
        const block = document.createElement('div');
        block.style.width = '20px';
        block.style.height = '20px';
        block.style.backgroundColor = color;
        block.style.cursor = 'pointer';
        block.style.border = '1px solid #ddd';
        
        // Add drag and drop capability (simplified)
        block.draggable = true;
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', color);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        block.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        block.addEventListener('drop', (e) => {
            e.preventDefault();
            const sourceColor = e.dataTransfer.getData('text/plain');
            
            // Swap colors
            const source = Array.from(fm100Div.children).find(el => el.style.backgroundColor === sourceColor);
            if (source) {
                const targetColor = block.style.backgroundColor;
                block.style.backgroundColor = sourceColor;
                source.style.backgroundColor = targetColor;
            }
        });
        
        fm100Div.appendChild(block);
    });
    
    container.appendChild(fm100Div);
    
    // Add instructions
    const instructions = document.createElement('p');
    instructions.textContent = 'Example of an FM100 test. Try to arrange the colors in a gradient (drag and drop)';
    instructions.style.marginTop = '10px';
    container.appendChild(instructions);
    
    // Add buttons for solving and resetting
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = '10px';
    
    const solveButton = document.createElement('button');
    solveButton.textContent = 'Show Solved';
    solveButton.style.padding = '5px 10px';
    solveButton.style.borderRadius = '5px';
    solveButton.style.border = '1px solid #ccc';
    solveButton.style.backgroundColor = '#f0f0f0';
    solveButton.style.cursor = 'pointer';
    
    solveButton.addEventListener('click', () => {
        // Replace with ordered colors
        const blocks = fm100Div.children;
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].style.backgroundColor = colors[i];
        }
    });
    
    const randomizeButton = document.createElement('button');
    randomizeButton.textContent = 'Randomize';
    randomizeButton.style.padding = '5px 10px';
    randomizeButton.style.borderRadius = '5px';
    randomizeButton.style.border = '1px solid #ccc';
    randomizeButton.style.backgroundColor = '#f0f0f0';
    randomizeButton.style.cursor = 'pointer';
    
    randomizeButton.addEventListener('click', () => {
        // Re-shuffle the colors
        const newShuffled = [...colors];
        for (let i = newShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
        }
        
        const blocks = fm100Div.children;
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].style.backgroundColor = newShuffled[i];
        }
    });
    
    buttonContainer.appendChild(randomizeButton);
    buttonContainer.appendChild(solveButton);
    container.appendChild(buttonContainer);
}