import React, { Component } from "react";
import drawsankey from "./vis";

export default class SankeyPlot extends Component {
  componentDidMount() {
    drawsankey(this.props);
  }

  componentDidUpdate(preProps) {
    drawsankey(this.props);
  }

  render() {
    return <div className="vis-sankey" />;
  }
}
