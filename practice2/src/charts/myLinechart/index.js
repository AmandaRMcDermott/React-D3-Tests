import React, { Component } from "react";
import drawlinechart from "./vis";

export default class LineChart extends Component {
  componentDidMount() {
    drawlinechart(this.props);
  }

  componentDidUpdate(preProps) {
    drawlinechart(this.props);
  }

  render() {
    return (
      <div className="vis-linechart2">
        <div id="tooltip" className="tooltip">
          <div className="tooltip-date">
            <span id="date"></span>
          </div>
          <div className="tooltip-temperature">
            Maximum Temperature: <span id="temperature"></span>
          </div>
        </div>
      </div>
    );
  }
}
