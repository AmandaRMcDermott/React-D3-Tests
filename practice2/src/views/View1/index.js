import React, { Component } from "react";
//import './view1.css';
import drawLineChart from "../../charts/myLinechart";

export default class View1 extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div id="view1" className="pane">
        <div className="header">testing</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <drawLineChart data={data} width={1100} height={250} />
        </div>
      </div>
    );
  }
}
