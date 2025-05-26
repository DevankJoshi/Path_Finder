# 🧭 Path Quest

**Path Quest** is a dynamic and educational pathfinding visualizer built with HTML, CSS, and JavaScript. It allows users to interactively place nodes, draw walls, and observe how popular pathfinding algorithms explore the grid to find the shortest path.

## 🚀 Demo

Try the live demo (if hosted) or run locally by opening `index.html`.

## 📸 Screenshot

![Path Quest Screenshot](screenshot.png) <!-- Add your screenshot image to the repo and update this path -->

## 🧠 Algorithms Implemented

- **Dijkstra’s Algorithm** – Guarantees the shortest path (weighted).
- **Breadth-First Search (BFS)** – Guarantees the shortest path (unweighted).
- **Depth-First Search (DFS)** – Does not guarantee the shortest path.
- **A\* Algorithm** – Guarantees the shortest path using heuristics (Manhattan distance).

## 🎮 How to Use

1. **Choose an Algorithm** from the dropdown.
2. **Click & Drag** to place walls on the grid.
3. **Set Start/End Nodes** using the respective buttons.
4. Click **"Visualize Algorithm"** to begin the animation.
5. Use **"Reset Grid"** to clear walls and results.
6. Click **"Generate Random Maze"** to populate walls randomly.

## 🧱 Tech Stack

- HTML5
- CSS3 (with Bootstrap styling)
- Vanilla JavaScript (modularized in `grid.js` and `pathfinding.js`)

## 📁 Project Structure
PathQuest/
├── index.html               # Main UI
├── static/
│   ├── css/
│   │   └── style.css        # Styling and animations
│   └── js/
│       ├── grid.js          # Grid creation & interaction logic
│       └── pathfinding.js   # Algorithms and visualization
├── app.py                   # Flask backend placeholder (optional use)
└── README.md

## 🛠️ Setup Instructions

No build tools or installations required. Just clone and open:

```bash
git clone https://github.com/yourusername/path-quest.git
cd path-quest
open index.html  # or double-click in your file explorer
