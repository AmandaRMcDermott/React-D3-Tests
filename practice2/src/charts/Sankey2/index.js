import React, { Component } from "react";
import drawsankey from "./vis";

export default class SankeyPlot extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./sankey_source.js";
    document.body.appendChild(script);
    drawsankey(this.props);
  }

  componentDidUpdate(preProps) {
    drawsankey(this.props);
  }

  render() {
    return <div className="vis-sankey2" />;
  }
}
