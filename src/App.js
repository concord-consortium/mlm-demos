import React, { Component } from 'react';
import './App.css';

import Graph from './components/graph';
import OrganelleWrapper from './components/organelle-wrapper';

const graph = {
  nodes: [
    { id: "A", label: "α-MSH", x: 100, y: 100, selected: true },
    { id: "B", label: "cAMP",x: 300, y: 100 },
    { id: "C", x: 500, y: 100 },
    { id: "D", x: 700, y: 100 }
  ],
  edges: [
    { origin: "A", destination: "B" },
    { origin: "B", destination: "C" },
    { origin: "C", destination: "D" }
  ]
};

// hack
const ABGraph = {
  nodes: [
    { id: "A", label: "α-MSH", x: 100, y: 100 },
    { id: "B", label: "cAMP", x: 300, y: 100 },
    { id: "C", x: 500, y: 100 },
    { id: "D", x: 700, y: 100 },
    { id: "AB", label: "", x: 200, y: 100, r: 10 },
    { id: "AB1", label: "1", x: 120, y: 165, r: 30, selected: true },
    { id: "AB2", label: "2", x: 200, y: 165, r: 30 },
    { id: "AB3", label: "3", x: 280, y: 165, r: 30 }
  ],
  edges: [
    { origin: "A", destination: "AB" },
    { origin: "AB", destination: "B" },
    { origin: "B", destination: "C" },
    { origin: "C", destination: "D" },
    { origin: "AB", destination: "AB1" },
    { origin: "AB1", destination: "AB2" },
    { origin: "AB2", destination: "AB3" },
    { origin: "AB3", destination: "AB" }
  ]
};

let currentGraph = graph;

const graphState = {
  A: {
    modelProperties: {
      albino: false,
      working_tyr1: false,
      working_myosin_5a: false,
      open_gates: false
    },
    name: "α-MSH"
  },
  B: {
    modelProperties: {
      albino: false,
      working_tyr1: false,
      working_myosin_5a: false,
      open_gates: false
    },
    name: "cAMP"
  },
  C: {
    modelProperties: {
      albino: false,
      working_tyr1: true,
      working_myosin_5a: false,
      open_gates: false
    },
    name: "Large amount of Tyr1 available"
  },
  D: {
    modelProperties: {
      albino: false,
      working_tyr1: true,
      working_myosin_5a: true,
      open_gates: false
    },
    name: "Myosin_5a available"
  },
  AB1: {
    modelProperties: {
      albino: false,
      working_tyr1: true,
      working_myosin_5a: true,
      open_gates: false
    },
    name: "Hormone binding to receptor"
  },
  AB2: {
    modelProperties: {
      albino: false,
      working_tyr1: true,
      working_myosin_5a: true,
      open_gates: false
    },
    name: "G-Protein dissociation"
  },
  AB3: {
    modelProperties: {
      albino: false,
      working_tyr1: true,
      working_myosin_5a: true,
      open_gates: false
    },
    name: "cAMP production"
  }
}

let currentGraphState = graphState.A;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBinding: false
    };
    this.onEdgeClick = this.onEdgeClick.bind(this);
    this.onSetGraphState = this.onSetGraphState.bind(this);
  }

  onNodeClick = (node) => {
    currentGraph = graph;
    this.setState({showBinding: false});

    currentGraph.nodes.forEach((n) => n.selected = n.id === node.id);

    currentGraphState = graphState[node.id];

    this.forceUpdate();
  }

  onEdgeClick = (edge) => {
    currentGraph = ABGraph;
    currentGraphState = graphState.AB1;
    currentGraph.nodes.forEach((n) => n.selected = n.id === "AB1");
    this.setState({showBinding: true});
  }

  onSetGraphState(id) {
    currentGraph.nodes.forEach((n) => n.selected = n.id === id);
    currentGraphState = graphState[id];
    this.forceUpdate();
  }

  revert = () => {
    let letter;
    if (currentGraphState === graphState.B) {
      letter = "A";
      currentGraphState = graphState.A
    } else if (currentGraphState === graphState.C) {
      letter = "B"
      currentGraphState = graphState.B
    }
    if (letter) {
      graph.nodes.forEach((n) => {
        if (n.id===letter) {
          n.selected = true;
        } else {
          n.selected = false;
        }
      });
    }
    
    this.forceUpdate();
  }

  onButtonClick = () => {
    let letter;
    if (currentGraphState === graphState.A) {
      letter = "B";
      currentGraphState = graphState.B
      setTimeout(() => {this.revert()}, 3000);
    } else if (currentGraphState === graphState.B) {
      letter = "C"
      currentGraphState = graphState.C
      setTimeout(() => {this.revert()}, 3000);
    }
    if (letter) {
      graph.nodes.forEach((n) => {
        if (n.id===letter) {
          n.selected = true;
        } else {
          n.selected = false;
        }
      });
    }
    
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">State-Graph Demo</h1>
        </header>
        <Graph graph={currentGraph} onNodeClick={this.onNodeClick} onEdgeClick={this.onEdgeClick}/>
        <button onClick={this.onButtonClick}>Add Tyr_1</button>
        <div className="state"><b>State:</b> {currentGraphState.name}</div>
        <div>
          <OrganelleWrapper 
            modelProperties={currentGraphState.modelProperties} 
            showBinding={this.state.showBinding}
            setGraphState={this.onSetGraphState}
          />
        </div>
      </div>
    );
  }
}

export default App;
