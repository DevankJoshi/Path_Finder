from flask import Flask, render_template, jsonify

# Create the Flask application
app = Flask(__name__)


@app.route('/')
def index():
    """Render the main page of the pathfinding visualizer."""
    return render_template('index.html')

@app.route('/api/algorithms')
def get_algorithms():
    """Return a list of available pathfinding algorithms."""
    algorithms = [
        {'id': 'dijkstra', 'name': "Dijkstra's Algorithm", 'description': 'Guarantees the shortest path'},
        {'id': 'bfs', 'name': 'Breadth-First Search', 'description': 'Guarantees the shortest path (unweighted)'},
        {'id': 'dfs', 'name': 'Depth-First Search', 'description': 'Does not guarantee the shortest path'},
        {'id': 'astar', 'name': 'A* Algorithm', 'description': 'Guarantees the shortest path (uses heuristics)'}
    ]
    return jsonify(algorithms)

# This is the part that was originally in main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)