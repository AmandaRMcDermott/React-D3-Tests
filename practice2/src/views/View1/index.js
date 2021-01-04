import React, { Component } from "react";
import "./view1.css";
import LineChart from "../../charts/myLinechart";

export default class View1 extends Component {
  render() {
    const { data } = this.props,
      width = 100,
      height = 250;

    return (
      <div id="view1" className="pane">
        <div className="header">testing2</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <LineChart data={data} width={width} height={height} />
        </div>
      </div>
    );
  }
}
