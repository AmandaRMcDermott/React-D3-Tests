import React, { Component } from "react";
import "./view2.css";
import SankeyPlot from "../../charts/Sankey";
//import LineChart from "../../charts/myLinechart";

export default class View2 extends Component {
  render() {
    const { data } = this.props,
      width = 100,
      height = 250;

    return (
      <div id="view2" className="pane">
        <div className="header">Sankey</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <SankeyPlot data={data} width={width} height={height} />
        </div>
      </div>
    );
  }
}
