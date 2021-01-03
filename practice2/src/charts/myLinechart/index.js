import React, { Component } from "react";
import drawlinechart from "./vis";
import * as d3 from "d3";
import data from "../../data/nyc_data3.csv";

/*
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
*/

export default class LineChart extends Component {
  componentDidMount() {
    drawlinechart(this.state);
  }

  componentDidUpdate(preProps) {
    drawlinechart(this.state);
  }

  render() {
    return <div className="vis-linechart2" />;
  }
}
