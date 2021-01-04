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
    return <div className="vis-linechart2" />;
  }
}
