/**
 * Visualizes the selected pathfinding algorithm
 */
function visualizeAlgorithm() {
    document.querySelector('.timer-bar').style.width = '0%';
   document.querySelector('.timer-text').textContent = 'Time: 0ms';
   
   const startTime = performance.now();
   // Get the selected algorithm
   const algorithm = document.getElementById('algorithm-select').value;
   
   // Disable the start button during visualization
   document.getElementById('start-button').disabled = true;
   
   // Reset any previous algorithm visualization
   resetAlgorithm();
   
   // Run the appropriate algorithm
   switch (algorithm) {
       case 'dijkstra':
           visualizeDijkstra(startTime);
           break;
       case 'bfs':
           visualizeBFS(startTime);
           break;
       case 'dfs':
           visualizeDFS(startTime);
           break;
       case 'astar':
           visualizeAStar(startTime);
           break;
       default:
           visualizeDijkstra(startTime);
   }
}

/**
* Visualizes Dijkstra's algorithm for pathfinding
*/
function visualizeDijkstra(startTime) {
   // Get the grid nodes in array format for processing
   const nodes = getAllNodes();
   
   // Set the start node's distance to 0
   const startNodeData = grid[startNode.row][startNode.col];
   startNodeData.distance = 0;
   
   // Initialize the unvisited nodes
   const unvisitedNodes = [...nodes];
   
   // Collect visited nodes in order for animation
   const visitedNodesInOrder = [];
   
   // Main Dijkstra loop
   while (unvisitedNodes.length) {
       // Sort the unvisited nodes by distance
       sortNodesByDistance(unvisitedNodes);
       
       // Get the closest node
       const closestNode = unvisitedNodes.shift();
       
       // If we encounter a wall, skip it
       if (closestNode.isWall) continue;
       
       // If the closest node has a distance of Infinity, we're stuck
       if (closestNode.distance === Infinity) {
           // No path found, animate what we've visited
           animateAlgorithm(visitedNodesInOrder, [], 'dijkstra');
           return;
       }
       
       // Mark the node as visited
       closestNode.isVisited = true;
       visitedNodesInOrder.push(closestNode);
       
       // If we've reached the end node, we're done
       if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
           const shortestPath = getShortestPath(grid[endNode.row][endNode.col]);
            animateAlgorithm(visitedNodesInOrder, shortestPath, 'dijkstra', startTime);
           return;
       }
       
       // Update the distances of the neighboring nodes
       updateUnvisitedNeighbors(closestNode);
   }
   
   // If we get here, no path was found
   animateAlgorithm(visitedNodesInOrder, [], 'dijkstra');
}

/**
* Visualizes Breadth-First Search algorithm for pathfinding
*/
function visualizeBFS(startTime) {
   // Get the start and end nodes
   const startNodeData = grid[startNode.row][startNode.col];
   const endNodeData = grid[endNode.row][endNode.col];
   
   // Queue for BFS
   const queue = [startNodeData];
   const visitedNodesInOrder = [];
   
   // Mark the start node as visited
   startNodeData.isVisited = true;
   
   // BFS main loop
   while (queue.length > 0) {
       // Get the first node from the queue
       const currentNode = queue.shift();
       visitedNodesInOrder.push(currentNode);
       
       // Check if we've reached the end node
       if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
           const shortestPath = getShortestPath(endNodeData);
           animateAlgorithm(visitedNodesInOrder, shortestPath, 'bfs', startTime);
           return;
       }
       
       // Get the unvisited neighbors
       const neighbors = getNeighbors(currentNode);
       
       // Add unvisited neighbors to the queue
       for (const neighbor of neighbors) {
           neighbor.isVisited = true;
           neighbor.previousNode = currentNode;
           queue.push(neighbor);
       }
   }
   
   // If we get here, no path was found
   animateAlgorithm(visitedNodesInOrder, [], 'bfs');
}

/**
* Visualizes Depth-First Search algorithm for pathfinding
*/
function visualizeDFS(startTime) {
   // Get the start and end nodes
   const startNodeData = grid[startNode.row][startNode.col];
   const endNodeData = grid[endNode.row][endNode.col];
   
   // Collect visited nodes in order for animation
   const visitedNodesInOrder = [];
   
   // Function to check if we can proceed with DFS
   function canProceedDFS(node) {
       return !node.isVisited && !node.isWall;
   }
   
   // DFS function using stack (iterative approach)
   function dfsIterative() {
       const stack = [startNodeData];
       
       while (stack.length > 0) {
           const currentNode = stack.pop();
           
           if (currentNode.isVisited) continue;
           
           // Mark the node as visited
           currentNode.isVisited = true;
           visitedNodesInOrder.push(currentNode);
           
           // Check if we've reached the end node
           if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
               return true;
           }
           
           // Get the neighbors (all 4 directions)
           const { row, col } = currentNode;
           const neighbors = [];
           
           // Check the 4 adjacent cells (left, down, right, up - order matters for DFS)
           if (col > 0) neighbors.push(grid[row][col - 1]); // Left
           if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]); // Down
           if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]); // Right
           if (row > 0) neighbors.push(grid[row - 1][col]); // Up
           
           // Add unvisited neighbors to the stack
           for (let i = neighbors.length - 1; i >= 0; i--) {
               const neighbor = neighbors[i];
               if (canProceedDFS(neighbor)) {
                   neighbor.previousNode = currentNode;
                   stack.push(neighbor);
               }
           }
       }
       
       return false; // No path found
   }
   
   // Start DFS from the start node
   const pathFound = dfsIterative();
   
   // Get the shortest path if a path was found
   const shortestPath = pathFound ? getShortestPath(endNodeData) : [];
   
   // Animate the algorithm
  animateAlgorithm(visitedNodesInOrder, shortestPath, 'dfs', startTime);
}

/**
* Visualizes A* algorithm for pathfinding
*/
function visualizeAStar(startTime) {
   // Get the start and end nodes
   const startNodeData = grid[startNode.row][startNode.col];
   const endNodeData = grid[endNode.row][endNode.col];
   
   // Set the start node's distance to 0
   startNodeData.distance = 0;
   startNodeData.fScore = heuristic(startNodeData, endNodeData);
   
   // Open set (nodes to be evaluated)
   const openSet = [startNodeData];
   
   // Closed set (nodes already evaluated)
   const closedSet = [];
   
   // A* main loop
   while (openSet.length > 0) {
       // Sort the open set by fScore (distance + heuristic)
       sortNodesByFScore(openSet);
       
       // Get the node with the lowest fScore
       const currentNode = openSet.shift();
       
       // Skip if already in closed set
       if (closedSet.some(node => node.row === currentNode.row && node.col === currentNode.col)) continue;
       
       // Add to closed set
       closedSet.push(currentNode);
       currentNode.isVisited = true;
       
       // Check if we've reached the end node
       if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
           const shortestPath = getShortestPath(endNodeData);
           animateAlgorithm(closedSet, shortestPath, 'astar', startTime);
           return;
       }
       
       // Get all neighbors
       const neighbors = getNeighborsAll(currentNode);
       
       for (const neighbor of neighbors) {
           // Skip walls and already evaluated nodes
           if (neighbor.isWall || closedSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) continue;
           
           // Calculate the tentative gScore (distance from start)
           const tentativeGScore = currentNode.distance + 1;
           
           // Check if this is a better path or if the neighbor is not yet in the open set
           const isInOpenSet = openSet.some(node => node.row === neighbor.row && node.col === neighbor.col);
           
           if (!isInOpenSet || tentativeGScore < neighbor.distance) {
               // Update the neighbor's scores
               neighbor.previousNode = currentNode;
               neighbor.distance = tentativeGScore;
               neighbor.fScore = tentativeGScore + heuristic(neighbor, endNodeData);
               
               // Add to the open set if not already there
               if (!isInOpenSet) {
                   openSet.push(neighbor);
               }
           }
       }
   }
   
   // If we get here, no path was found
   animateAlgorithm(closedSet, [], 'astar');
}

/**
* Heuristic function for A* (Manhattan distance)
* @param {Object} node - The current node
* @param {Object} endNode - The end node
* @returns {number} - The heuristic value
*/
function heuristic(node, endNode) {
   return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

/**
* Sorts nodes by their fScore (for A*)
* @param {Array} nodes - The nodes to sort
*/
function sortNodesByFScore(nodes) {
   nodes.sort((a, b) => a.fScore - b.fScore);
}

/**
* Gets all neighbors (not just unvisited) of a node
* @param {Object} node - The node whose neighbors to get
* @returns {Array} - All neighboring nodes that aren't walls
*/
function getNeighborsAll(node) {
   const neighbors = [];
   const { row, col } = node;
   
   // Check the 4 adjacent cells (up, right, down, left)
   if (row > 0) neighbors.push(grid[row - 1][col]);
   if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);
   if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
   if (col > 0) neighbors.push(grid[row][col - 1]);
   
   // Filter out walls
   return neighbors.filter(neighbor => !neighbor.isWall);
}

/**
* Generates a random maze using the recursive division algorithm
*/
function generateMaze() {
   // Reset the grid first
   resetGrid();
   
   // Randomly place walls
   const walls = [];
   
   // Add border walls
   for (let row = 0; row < GRID_ROWS; row++) {
       for (let col = 0; col < GRID_COLS; col++) {
           if (row === 0 || row === GRID_ROWS - 1 || col === 0 || col === GRID_COLS - 1) {
               if (!(row === startNode.row && col === startNode.col) && 
                   !(row === endNode.row && col === endNode.col)) {
                   grid[row][col].isWall = true;
                   updateNodeAppearance(grid[row][col]);
               }
           }
       }
   }
   
   // Recursively divide the maze
   recursiveDivision(1, GRID_ROWS - 2, 1, GRID_COLS - 2, walls);
   
   // Animate the walls
   animateWalls(walls);
}

/**
* Recursive division algorithm for maze generation
* @param {number} startRow - The starting row
* @param {number} endRow - The ending row
* @param {number} startCol - The starting column
* @param {number} endCol - The ending column
* @param {Array} walls - Array to store the wall nodes
*/
function recursiveDivision(startRow, endRow, startCol, endCol, walls) {
   // Base case: If the area is too small, return
   if (endRow - startRow < 2 || endCol - startCol < 2) return;
   
   // Decide whether to divide horizontally or vertically
   const horizontal = Math.random() > 0.5;
   
   if (horizontal) {
       // Horizontal division
       const row = Math.floor(Math.random() * (endRow - startRow)) + startRow;
       const hole = Math.floor(Math.random() * (endCol - startCol)) + startCol;
       
       // Create horizontal wall
       for (let col = startCol; col <= endCol; col++) {
           if (col !== hole && 
               !(row === startNode.row && col === startNode.col) && 
               !(row === endNode.row && col === endNode.col)) {
               walls.push(grid[row][col]);
           }
       }
       
       // Recursively divide the top and bottom sections
       recursiveDivision(startRow, row - 1, startCol, endCol, walls);
       recursiveDivision(row + 1, endRow, startCol, endCol, walls);
   } else {
       // Vertical division
       const col = Math.floor(Math.random() * (endCol - startCol)) + startCol;
       const hole = Math.floor(Math.random() * (endRow - startRow)) + startRow;
       
       // Create vertical wall
       for (let row = startRow; row <= endRow; row++) {
           if (row !== hole && 
               !(row === startNode.row && col === startNode.col) && 
               !(row === endNode.row && col === endNode.col)) {
               walls.push(grid[row][col]);
           }
       }
       
       // Recursively divide the left and right sections
       recursiveDivision(startRow, endRow, startCol, col - 1, walls);
       recursiveDivision(startRow, endRow, col + 1, endCol, walls);
   }
}

/**
* Animates the maze walls
* @param {Array} walls - The wall nodes to animate
*/
function animateWalls(walls) {
   for (let i = 0; i < walls.length; i++) {
       setTimeout(() => {
           const node = walls[i];
           node.isWall = true;
           updateNodeAppearance(node);
       }, 10 * i);
   }
}

/**
* Updates the distances of unvisited neighbors of a node
* @param {Object} node - The node whose neighbors to update
*/
function updateUnvisitedNeighbors(node) {
   const neighbors = getNeighbors(node);
   
   for (const neighbor of neighbors) {
       // Update the neighbor's distance
       neighbor.distance = node.distance + 1;
       neighbor.previousNode = node;
   }
}

/**
* Gets the unvisited neighboring nodes of a node
* @param {Object} node - The node whose neighbors to get
* @returns {Array} - The unvisited neighboring nodes
*/
function getNeighbors(node) {
   const neighbors = [];
   const { row, col } = node;
   
   // Check the 4 adjacent cells (up, right, down, left)
   if (row > 0) neighbors.push(grid[row - 1][col]);
   if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);
   if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
   if (col > 0) neighbors.push(grid[row][col - 1]);
   
   // Filter out visited nodes and walls
   return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

/**
* Gets all nodes in the grid as a flat array
* @returns {Array} - All nodes in the grid
*/
function getAllNodes() {
   const nodes = [];
   
   for (const row of grid) {
       for (const node of row) {
           nodes.push(node);
       }
   }
   
   return nodes;
}

/**
* Sorts nodes by their distance
* @param {Array} nodes - The nodes to sort
*/
function sortNodesByDistance(nodes) {
   nodes.sort((a, b) => a.distance - b.distance);
}

/**
* Gets the shortest path from start to end node
* @param {Object} endNode - The end node
* @returns {Array} - The nodes in the shortest path
*/
function getShortestPath(endNode) {
   const shortestPath = [];
   let currentNode = endNode;
   
   // Backtrack from the end node to the start node
   while (currentNode !== null && currentNode.previousNode !== null) {
       shortestPath.unshift(currentNode);
       currentNode = currentNode.previousNode;
   }
   
   return shortestPath;
}

/**
* Animates the algorithm visualization
* @param {Array} visitedNodesInOrder - The nodes visited in order
* @param {Array} shortestPath - The nodes in the shortest path
* @param {string} algorithm - The algorithm being visualized
*/
function animateAlgorithm(visitedNodesInOrder, shortestPath, algorithm, startTime) {
   // Determine the CSS class for visited nodes based on the algorithm
   let visitedClass = NODE_TYPES.VISITED;
   switch (algorithm) {
       case 'bfs':
           visitedClass = 'node-visited-bfs';
           break;
       case 'dfs':
           visitedClass = 'node-visited-dfs';
           break;
       case 'astar':
           visitedClass = 'node-visited-astar';
           break;
   }
   
   // Animate the visited nodes
   for (let i = 0; i < visitedNodesInOrder.length; i++) {
       setTimeout(() => {
           const node = visitedNodesInOrder[i];
           
           // Don't animate the start and end nodes
           if (!node.isStart && !node.isEnd) {
               node.element.classList.add(visitedClass);
           }
           
           // After all visited nodes are animated, animate the shortest path
           if (i === visitedNodesInOrder.length - 1) {
               setTimeout(() => {
                   animateShortestPath(shortestPath);
               }, 100);
           }
       }, 10 * i);
   }
   
   // If no nodes were visited, re-enable the start button
   if (visitedNodesInOrder.length === 0) {
       document.getElementById('start-button').disabled = false;
   }
   const totalDelay = visitedNodesInOrder.length * 10 + (shortestPath.length * 50) + 200;
   
   setTimeout(() => {
       const endTime = performance.now();
       const timeTaken = endTime - startTime;
       updateTimerDisplay(timeTaken);
   }, totalDelay);

}
// New function to update timer display
function updateTimerDisplay(timeTaken) {
   const timerBar = document.querySelector('.timer-bar');
   const timerText = document.querySelector('.timer-text');
   const maxDisplayTime = 5000; // 5 seconds for 100% width
   
   // Convert milliseconds to seconds and round to 2 decimal places
   const timeInSeconds = (timeTaken / 1000).toFixed(2);
   
   timerBar.style.width = `${Math.min((timeTaken / maxDisplayTime) * 100, 100)}%`;
   timerText.textContent = `Time: ${timeInSeconds}s`;  // Changed from ms to s
}

/**
* Animates the shortest path
* @param {Array} shortestPath - The nodes in the shortest path
*/
function animateShortestPath(shortestPath) {
   for (let i = 0; i < shortestPath.length; i++) {
       setTimeout(() => {
           const node = shortestPath[i];
           
           // Don't animate the start and end nodes
           if (!node.isStart && !node.isEnd) {
               node.isPath = true;
               node.element.classList.remove(
                   NODE_TYPES.VISITED, 
                   'node-visited-bfs', 
                   'node-visited-dfs', 
                   'node-visited-astar'
               );
               node.element.classList.add(NODE_TYPES.PATH);
           }
           
           // After all path nodes are animated, re-enable the start button
           if (i === shortestPath.length - 1) {
               setTimeout(() => {
                   document.getElementById('start-button').disabled = false;
               }, 100);
           }
       }, 50 * i);
   }
   
   // If no path was found, re-enable the start button
   if (shortestPath.length === 0) {
       setTimeout(() => {
           document.getElementById('start-button').disabled = false;
       }, 100);
   }
}