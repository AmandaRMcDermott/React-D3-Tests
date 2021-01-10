import React, { Component } from "react";
import "./view3.css";
import LineChart from "../../charts/Linechart";

export default class View3 extends Component {
  render() {
    const { user } = this.props,
      width = 1100,
      height = 450;

    return (
      <div id="view3" className="pane">
        <div className="header">Testing</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <LineChart data={user} width={width} height={height} />
        </div>
      </div>
    );
  }
}
