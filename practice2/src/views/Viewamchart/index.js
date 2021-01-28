import React, { Component } from "react";
import "./viewamchart.css";
import SankeyPlotAm from "../../charts/amchartsSankey";
//import LineChart from "../../charts/myLinechart";

export default class Viewamchart extends Component {
  render() {
    const { data } = this.props,
      width = 100,
      height = 500;

    return (
      <div id="viewamchart" className="pane">
        <div className="header">Sankey test</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <SankeyPlotAm  width={width} height={height} />
        </div>
      </div>
    );
  }
}
