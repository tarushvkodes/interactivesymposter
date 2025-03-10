/**
 * Main JavaScript file for the Interactive Symposium Poster
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll behavior
    initSmoothScroll();
    
    // Initialize navigation effects
    initNavigationEffects();
    
    // Initialize section animations
    initSectionAnimations();
    
    // Set up the expected results chart
    setupExpectedResultsChart();
    
    // Initialize 3D model viewer
    setupModelViewer();

    // Setup interactive Ishihara test example
    setupIshiharaExample();
    
    // Setup FM100 test example
    setupFM100Example();
});

function initSmoothScroll() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

function initNavigationEffects() {
    const nav = document.querySelector('.poster-nav');
    const navItems = document.querySelectorAll('.poster-nav a');
    let lastScrollY = window.scrollY;
    
    // Navigation scroll effect
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add blur effect when scrolling
        if (currentScrollY > 0) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            nav.style.backdropFilter = 'saturate(180%) blur(20px)';
        } else {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            nav.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Highlight current section in navigation
    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('.poster-section').forEach(section => {
            if (section.offsetTop <= scrollPosition && 
                section.offsetTop + section.offsetHeight > scrollPosition) {
                const currentId = section.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

function initSectionAnimations() {
    // Intersection Observer for section animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.poster-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });
    
    // Initialize interactive elements with subtle hover effects
    document.querySelectorAll('.interactive-element, .info-box, .hypothesis').forEach(element => {
        element.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.12)';
        });
        
        element.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
    chartTitle.textContent = 'Expected Improvement in Test Scores with Different Dye Concentrations';
    chartTitle.style.textAlign = 'center';
    chartTitle.style.marginBottom = '2rem';
    chartContainer.appendChild(chartTitle);
    
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    chartWrapper.style.display = 'flex';
    chartWrapper.style.height = '300px';
    chartWrapper.style.alignItems = 'flex-end';
    chartWrapper.style.gap = '20px';
    chartWrapper.style.padding = '20px 60px 40px 60px'; // Increased padding for labels
    chartWrapper.style.position = 'relative';
    chartWrapper.style.backgroundColor = '#fff';
    chartWrapper.style.borderRadius = '8px';
    chartWrapper.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Fix y-axis label position
    const yAxisLabel = document.createElement('div');
    yAxisLabel.style.position = 'absolute';
    yAxisLabel.style.transform = 'rotate(-90deg) translateX(-50%)';
    yAxisLabel.style.transformOrigin = '0 0';
    yAxisLabel.style.left = '15px';
    yAxisLabel.style.top = '50%';
    yAxisLabel.style.fontSize = '14px';
    yAxisLabel.style.whiteSpace = 'nowrap';
    yAxisLabel.textContent = 'Error Score';
    chartWrapper.appendChild(yAxisLabel);
    
    // Add horizontal lines for reference
    for (let i = 0; i <= 4; i++) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.left = '45px';
        line.style.right = '15px';
        line.style.top = `${20 + (i * 65)}px`;
        line.style.borderBottom = '1px dashed #ccc';
        line.style.zIndex = '1';
        
        const label = document.createElement('span');
        label.style.position = 'absolute';
        label.style.left = '-30px';
        label.style.top = '-10px';
        label.style.fontSize = '12px';
        label.textContent = `${Math.round((4 - i) * (maxScore / 4))}`;
        line.appendChild(label);
        
        chartWrapper.appendChild(line);
    }
    
    // Create bars wrapper for z-index control
    const barsWrapper = document.createElement('div');
    barsWrapper.style.display = 'flex';
    barsWrapper.style.alignItems = 'flex-end';
    barsWrapper.style.gap = '20px';
    barsWrapper.style.height = '100%';
    barsWrapper.style.width = '100%';
    barsWrapper.style.position = 'relative';
    barsWrapper.style.zIndex = '2';
    barsWrapper.style.marginLeft = '15px'; // Add margin to align with grid lines
    
    // Create bars for the chart
    concentrations.forEach((conc, index) => {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.flex = '1';
        barContainer.style.position = 'relative';
        
        const bar = document.createElement('div');
        const heightPercentage = (expectedScores[index] / maxScore) * 100;
        bar.style.width = '100%';
        bar.style.height = `${heightPercentage}%`;
        bar.style.backgroundColor = '#3498db';
        bar.style.borderRadius = '3px 3px 0 0';
        bar.style.transition = 'all 0.3s ease';
        bar.style.cursor = 'pointer';
        
        // Add hover effect
        bar.addEventListener('mouseover', function() {
            this.style.transform = 'scaleX(1.1)';
            value.style.opacity = '1';
        });
        
        bar.addEventListener('mouseout', function() {
            this.style.transform = 'scaleX(1)';
            value.style.opacity = '0.8';
        });
        
        // Add value on top of the bar
        const value = document.createElement('div');
        value.textContent = expectedScores[index];
        value.style.marginBottom = '5px';
        value.style.fontWeight = 'bold';
        value.style.fontSize = '12px';
        value.style.opacity = '0.8';
        value.style.transition = 'opacity 0.3s ease';
        
        // Add concentration label below the bar
        const label = document.createElement('div');
        label.textContent = `${conc}%`;
        label.style.marginTop = '8px';
        label.style.fontSize = '12px';
        
        // Create optimal marker for the best concentration
        if (expectedScores[index] === Math.min(...expectedScores)) {
            bar.style.backgroundColor = '#e74c3c';
            const optimal = document.createElement('div');
            optimal.textContent = 'Optimal';
            optimal.style.fontSize = '10px';
            optimal.style.fontWeight = 'bold';
            optimal.style.color = '#e74c3c';
            optimal.style.marginTop = '5px';
            barContainer.appendChild(optimal);
        }
        
        barContainer.appendChild(value);
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        barsWrapper.appendChild(barContainer);
    });
    
    chartWrapper.appendChild(barsWrapper);
    chartContainer.appendChild(chartWrapper);
    
    // Fix x-axis label positioning
    const xAxisLabel = document.createElement('div');
    xAxisLabel.style.textAlign = 'center';
    xAxisLabel.style.position = 'absolute';
    xAxisLabel.style.bottom = '10px';
    xAxisLabel.style.left = '0';
    xAxisLabel.style.right = '0';
    xAxisLabel.style.fontSize = '14px';
    xAxisLabel.textContent = 'Dye Concentration (%)';
    chartWrapper.appendChild(xAxisLabel);
    
    // Add caption
    const caption = document.createElement('p');
    caption.style.fontSize = '0.8rem';
    caption.style.marginTop = '30px';
    caption.style.fontStyle = 'italic';
    caption.style.textAlign = 'center';
    caption.style.color = '#666';
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
    
    // Add lighting for better realism
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Create a thin lens geometry without the frame
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 64);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        roughness: 0.2,
        metalness: 0.0,
        reflectivity: 0.8,
        transmission: 0.8
    });
    
    const lens = new THREE.Mesh(geometry, material);
    lens.rotation.x = Math.PI / 2;
    scene.add(lens);
    
    // Add interaction - rotation on mouse move
    modelContainer.addEventListener('mousemove', (event) => {
        const rect = modelContainer.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / modelContainer.clientWidth) * 2 - 1;
        const y = -(((event.clientY - rect.top) / modelContainer.clientHeight) * 2 - 1);
        
        lens.rotation.y = x * 2;
        lens.rotation.z = y;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        lens.rotation.y += 0.001;
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
    
    // Replace placeholder with an actual image
    container.innerHTML = '';
    
    // Create image element
    const img = document.createElement('img');
    img.src = 'images/ishihara.png';
    img.alt = 'Ishihara test plate';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '50%';
    img.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // Handle image loading errors
    img.onerror = function() {
        console.error('Failed to load Ishihara image');
        container.innerHTML = '<div class="ishihara-placeholder"></div>';
    };
    
    container.appendChild(img);
    
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
    button.addEventListener('click', function() {
        isDeuteranomaly = !isDeuteranomaly;
        button.textContent = isDeuteranomaly ? 'Normal View' : 'Simulate Deuteranomaly View';
        
        // Apply a filter to simulate deuteranomaly
        if (isDeuteranomaly) {
            img.style.filter = 'url(#deuteranomaly-filter)';
        } else {
            img.style.filter = 'none';
        }
    });
    
    container.appendChild(button);
    
    // Create SVG filter for deuteranomaly simulation
    const filterSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    filterSVG.style.width = '0';
    filterSVG.style.height = '0';
    filterSVG.style.position = 'absolute';
    
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'deuteranomaly-filter');
    
    const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    colorMatrix.setAttribute('type', 'matrix');
    colorMatrix.setAttribute('values', '0.8 0.2 0 0 0 0.25 0.75 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0');
    
    filter.appendChild(colorMatrix);
    filterSVG.appendChild(filter);
    document.body.appendChild(filterSVG);
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
    
    // Create color blocks with enhanced drag and drop
    shuffled.forEach((color, index) => {
        const block = document.createElement('div');
        block.className = 'fm100-color-block';
        block.style.backgroundColor = color;
        block.setAttribute('data-color', color);
        block.setAttribute('data-position', index.toString());
        
        // Drag events
        block.addEventListener('dragstart', (e) => {
            block.classList.add('dragging');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                color: color,
                position: index,
                sourceId: block.id
            }));
        });
        
        block.addEventListener('dragend', () => {
            block.classList.remove('dragging');
            document.querySelectorAll('.fm100-color-block').forEach(b => {
                b.classList.remove('drag-over');
            });
        });
        
        // Drop events
        block.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (!block.classList.contains('dragging')) {
                block.classList.add('drag-over');
            }
        });
        
        block.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        block.addEventListener('dragleave', () => {
            block.classList.remove('drag-over');
        });
        
        block.addEventListener('drop', (e) => {
            e.preventDefault();
            block.classList.remove('drag-over');
            
            try {
                const sourceData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const targetColor = block.style.backgroundColor;
                const targetPosition = parseInt(block.getAttribute('data-position'));
                
                // Swap the colors
                block.style.backgroundColor = sourceData.color;
                const sourceBlock = document.querySelector(`.fm100-color-block[data-position="${sourceData.position}"]`);
                if (sourceBlock && sourceBlock !== block) {
                    sourceBlock.style.backgroundColor = targetColor;
                }
            } catch (error) {
                console.error('Error during color swap:', error);
            }
        });
        
        block.draggable = true;
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
        const blocks = Array.from(fm100Div.children);
        blocks.forEach((block, i) => {
            block.style.backgroundColor = colors[i];
            block.setAttribute('data-position', i.toString());
        });
    });
    
    const randomizeButton = document.createElement('button');
    randomizeButton.textContent = 'Randomize';
    randomizeButton.style.padding = '5px 10px';
    randomizeButton.style.borderRadius = '5px';
    randomizeButton.style.border = '1px solid #ccc';
    randomizeButton.style.backgroundColor = '#f0f0f0';
    randomizeButton.style.cursor = 'pointer';
    
    randomizeButton.addEventListener('click', () => {
        const newShuffled = [...colors];
        for (let i = newShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
        }
        
        const blocks = Array.from(fm100Div.children);
        blocks.forEach((block, i) => {
            block.style.backgroundColor = newShuffled[i];
            block.setAttribute('data-position', i.toString());
        });
    });
    
    buttonContainer.appendChild(randomizeButton);
    buttonContainer.appendChild(solveButton);
    container.appendChild(buttonContainer);
}