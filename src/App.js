import React, { Component } from 'react';
import './App.css';

import Graph from './components/graph';

const graph = {
  nodes: [
    { id: "A", x: 100, y: 100, selected: true },
    { id: "B", x: 300, y: 100 },
    { id: "C", x: 500, y: 100 },
    { id: "D", x: 700, y: 100 }
  ],
  edges: [
    { origin: "A", destination: "B" },
    { origin: "B", destination: "C" },
    { origin: "C", destination: "D" }
  ]
};

class App extends Component {
  onNodeClick = (node) => {
    graph.nodes.forEach((n) => n.selected = false);
    node.selected = true;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">State-Graph Demo</h1>
        </header>
        <Graph graph={graph} onNodeClick={this.onNodeClick}/>
      </div>
    );
  }
}

export default App;
