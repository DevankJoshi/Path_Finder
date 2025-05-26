// Grid dimensions
const GRID_ROWS = 20;
const GRID_COLS = 50;

// Grid data
let grid = [];

// Start and end node positions
let startNode = { row: 10, col: 10 };
let endNode = { row: 10, col: 40 };

// Current placement mode
let placementMode = 'wall';
let isMousePressed = false;

// Node types for CSS classes
const NODE_TYPES = {
    START: 'node-start',
    END: 'node-end',
    WALL: 'node-wall',
    VISITED: 'node-visited',
    PATH: 'node-path'
};

// Algorithm descriptions
const ALGORITHM_DESCRIPTIONS = {
    dijkstra: 'Guarantees the shortest path',
    bfs: 'Guarantees the shortest path (unweighted)',
    dfs: 'Does not guarantee the shortest path',
    astar: 'Guarantees the shortest path (uses heuristics)'
};

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createGrid();
    setupEventListeners();
    
    // Initialize the algorithm description
    updateAlgorithmDescription();
    
    // Set default placement mode (wall)
    setPlacementMode('wall');
});

/**
 * Creates the grid on the page and initializes the grid data structure
 */
function createGrid() {
    const gridElement = document.getElementById('grid');
    
    // Clear any existing grid
    gridElement.innerHTML = '';
    
    // Initialize the grid data
    grid = new Array(GRID_ROWS);
    
    for (let row = 0; row < GRID_ROWS; row++) {
        grid[row] = new Array(GRID_COLS);
        
        for (let col = 0; col < GRID_COLS; col++) {
            // Create a node element
            const nodeElement = document.createElement('div');
            nodeElement.className = 'node';
            nodeElement.id = `node-${row}-${col}`;
            nodeElement.setAttribute('data-row', row);
            nodeElement.setAttribute('data-col', col);
            
            // Add event listeners for node interaction
            nodeElement.addEventListener('mousedown', handleMouseDown);
            nodeElement.addEventListener('mouseenter', handleMouseEnter);
            
            // Add the node to the grid
            gridElement.appendChild(nodeElement);
            
            // Initialize the node data
            grid[row][col] = {
                row: row,
                col: col,
                isStart: row === startNode.row && col === startNode.col,
                isEnd: row === endNode.row && col === endNode.col,
                isWall: false,
                isVisited: false,
                isPath: false,
                distance: Infinity,
                fScore: Infinity,
                previousNode: null,
                element: nodeElement
            };
            
            // Update the node's appearance
            updateNodeAppearance(grid[row][col]);
        }
    }
    
    // Add a mouseup event listener to the document
    document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Sets up the event listeners for the grid controls
 */
function setupEventListeners() {
    // Start button
    document.getElementById('start-button').addEventListener('click', visualizeAlgorithm);
    
    // Reset button
    document.getElementById('reset-button').addEventListener('click', resetGrid);
    
    // Generate maze button
    document.getElementById('generate-maze').addEventListener('click', generateMaze);
    
    // Algorithm selector
    document.getElementById('algorithm-select').addEventListener('change', updateAlgorithmDescription);
    
    // Placement mode buttons
    document.getElementById('place-start').addEventListener('click', () => setPlacementMode('start'));
    document.getElementById('place-end').addEventListener('click', () => setPlacementMode('end'));
    document.getElementById('place-wall').addEventListener('click', () => setPlacementMode('wall'));
}

/**
 * Updates the algorithm description based on the selected algorithm
 */
function updateAlgorithmDescription() {
    const algorithm = document.getElementById('algorithm-select').value;
    document.getElementById('algorithm-description').textContent = ALGORITHM_DESCRIPTIONS[algorithm];
}

/**
 * Sets the current node placement mode
 * @param {string} mode - The mode to set ('start', 'end', or 'wall')
 */
function setPlacementMode(mode) {
    placementMode = mode;
    
    // Remove active class from all buttons
    document.getElementById('place-start').classList.remove('active', 'btn-active');
    document.getElementById('place-end').classList.remove('active', 'btn-active');
    document.getElementById('place-wall').classList.remove('active', 'btn-active');
    
    // Add active class to the selected button
    document.getElementById(`place-${mode}`).classList.add('active', 'btn-active');
}

/**
 * Handles the mousedown event on a node
 * @param {Event} event - The event object
 */
function handleMouseDown(event) {
    isMousePressed = true;
    
    // Get the node's row and column
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    
    // Update the node
    updateNode(row, col);
}

/**
 * Handles the mouseenter event on a node
 * @param {Event} event - The event object
 */
function handleMouseEnter(event) {
    if (!isMousePressed) return;
    
    // Get the node's row and column
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    
    // Update the node
    updateNode(row, col);
}

/**
 * Handles the mouseup event
 */
function handleMouseUp() {
    isMousePressed = false;
}

/**
 * Updates a node based on the current placement mode
 * @param {number} row - The row of the node
 * @param {number} col - The column of the node
 */
function updateNode(row, col) {
    // Get the node data
    const node = grid[row][col];
    
    // Update the node based on the placement mode
    switch (placementMode) {
        case 'start':
            // Remove the start attribute from the old start node
            grid[startNode.row][startNode.col].isStart = false;
            updateNodeAppearance(grid[startNode.row][startNode.col]);
            
            // Update the start node
            startNode = { row, col };
            node.isStart = true;
            node.isWall = false;
            break;
            
        case 'end':
            // Remove the end attribute from the old end node
            grid[endNode.row][endNode.col].isEnd = false;
            updateNodeAppearance(grid[endNode.row][endNode.col]);
            
            // Update the end node
            endNode = { row, col };
            node.isEnd = true;
            node.isWall = false;
            break;
            
        case 'wall':
            // Toggle the wall status, but don't allow start or end to become walls
            if (!node.isStart && !node.isEnd) {
                node.isWall = !node.isWall;
            }
            break;
    }
    
    // Update the node's appearance
    updateNodeAppearance(node);
}

/**
 * Updates the appearance of a node based on its state
 * @param {Object} node - The node to update
 */
function updateNodeAppearance(node) {
    // Clear all classes from the node
    node.element.className = 'node';
    
    // Apply the appropriate class based on the node's state
    if (node.isStart) {
        node.element.classList.add(NODE_TYPES.START);
    } else if (node.isEnd) {
        node.element.classList.add(NODE_TYPES.END);
    } else if (node.isWall) {
        node.element.classList.add(NODE_TYPES.WALL);
    } else if (node.isPath) {
        node.element.classList.add(NODE_TYPES.PATH);
    } else if (node.isVisited) {
        node.element.classList.add(NODE_TYPES.VISITED);
    }
}

/**
 * Resets the grid to its initial state
 */
function resetGrid() {
    // Clear all node states
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const node = grid[row][col];
            
            // Reset all properties except start and end
            node.isWall = false;
            node.isVisited = false;
            node.isPath = false;
            node.distance = Infinity;
            node.fScore = Infinity;
            node.previousNode = null;
            
            // Update the node's appearance
            updateNodeAppearance(node);
        }
    }
    
    // Re-enable the start button
    document.getElementById('start-button').disabled = false;
}

/**
 * Resets just the algorithm visualization (not the walls)
 */
function resetAlgorithm() {
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const node = grid[row][col];
            
            // Reset the algorithm properties without changing walls
            node.isVisited = false;
            node.isPath = false;
            node.distance = Infinity;
            node.fScore = Infinity;
            node.previousNode = null;
            
            // Remove the visited and path classes
            node.element.classList.remove(
                NODE_TYPES.VISITED, 
                NODE_TYPES.PATH, 
                'node-visited-bfs', 
                'node-visited-dfs', 
                'node-visited-astar'
            );
        }
    }
}