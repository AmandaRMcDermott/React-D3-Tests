import React, { Component } from "react";
import drawLineChart from "./chart";

export default class LineChart extends Component {
  componentDidMount() {
    drawLineChart(this.props);
  }

  componentDidUpdate(preProps) {
    drawLineChart(this.props);
  }

  render() {
    return <div className="vis-linechart" />;
  }
}
