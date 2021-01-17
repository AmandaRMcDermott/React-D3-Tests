import React, { Component } from "react";
import "./view4.css";
import SankeyPlot from "../../charts/Sankey2";

export default class View4 extends Component {
  render() {
    const { data } = this.props,
      width = 100,
      height = 400;

    return (
      <div id="view2" className="pane">
        <div className="header">Sankey2</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <SankeyPlot data={data} width={width} height={height} />
        </div>
      </div>
    );
  }
}
