import React, { Component } from "react";
//import './view1.css';
import DrawLineChart from "../../charts/chart";
//import LineChart from '../../charts/LineChart';

export default class View1 extends Component {
  render() {
    //const { user } = (width = 1100), (height = 250);
    return (
      <div id="view4" className="pane">
        <div className="header">User Acivities</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <DrawLineChart width={1100} height={250} />
        </div>
      </div>
    );
  }
}
