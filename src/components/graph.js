import React, { Component } from 'react';

const findNode = (graph, id) => graph.nodes.find((n) => n.id === id);

export default class Graph extends Component {
  handleNodeClick(node) {
    return () => {
      this.props.onNodeClick(node);
    }
  }

  render() {
    const {graph} = this.props;
    const edgeViews = graph.edges.map((e) => {
      const o = findNode(graph, e.origin);
      const d = findNode(graph, e.destination);
      const path = `M${o.x} ${o.y} L${d.x} ${d.y}`;
      return (
        <g>
          <path d={path} stroke="black" strokeWidth="12" fill="transparent" />
          <path d={path} stroke="#61DAFB" strokeWidth="8" fill="transparent" />
        </g>
      );
    });

    const nodeViews = graph.nodes.map((n) => {
      const handleClick = this.handleNodeClick(n);
      return (
        <g onClick={handleClick}>
          <circle cx={n.x} cy={n.y} r="60" strokeWidth={n.selected ? 8 : 4} />
          <text fill="black" textAnchor="middle" alignmentBaseline="central" font-size="30px"
            x={n.x} y={n.y}>{n.id}</text>
        </g>
      );
    });

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
        <g>
          {edgeViews}
        </g>
        <g fill="#61DAFB" stroke="black">
          {nodeViews}
        </g>
      </svg>
    );
  }
}