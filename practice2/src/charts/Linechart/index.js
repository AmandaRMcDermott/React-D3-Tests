import React, { Component } from "react";
import draw from "./vis";
import * as d3 from "d3";
import data from "../../data/nyc_data3.csv";

export default class LineChart extends Component {
  componentDidMount() {
    d3.csv(data)
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        throw err;
      });
    //draw(this.props);
  }

  componentDidUpdate(preProps) {
    draw(this.props);
  }

  render() {
    return <div className="vis-linechart" />;
  }
}
