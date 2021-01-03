import { OmitProps } from "antd/lib/transfer/ListBody";
import * as d3 from "d3";
import _ from "lodash";
//import React from 'react';
//import ReactDOM from 'react-dom';
//import '../src/index.css';
//import App from './App';
//import reportWebVitals from './reportWebVitals';
import dataset from "../../data/nyc_data3.csv";

const drawlinechart = () => {
  d3.csv(dataset, function (dataset) {
    console.log(dataset);
  });
  /*
const drawlinechart = (props) => {
  let dataset = [];
  if (props.data !== null) {
    dataset = _.cloneDeep(props.dataset);
  }
  */
  //write your code here

  // 1. access the data
  // await is a S keyword that will PAUSE THE EXEC OF A FUNC
  // UNTIL A PROMISE IS RESOLVED (only works with async)
  // just means any code (w/i func) will wait to run until data is defined

  //const dataset = await d3.json("../../data/nyc_weather_data.json");

  //console.log(dataset);
  //console.table(dataset[0]s);

  // create a yAccessor for plotting y-axis pts
  const yAccessor = (d) => d.temperatureMax;

  // xAccessor
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);

  // Drawing the Chart

  // wrapper - contains the entire chart (data elements, axes, labels)
  // bounds - contains all data elements (line)

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15, // small top
      right: 15, // small right to give the chart space
      bottom: 40, // larger bottom for axes
      left: 60, // larger left for axes
    },
  };

  // size of the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // use d3.select()
  // three types of css selectors:
  // 1) select all elements w/ class name (.class)
  // 2) select all elements w/ id (#id)
  // 3) select all elements of a specfic node type (type)

  // select the "#wrapper" element from the index.html
  // 1.1) const wrapper = d3.select("#wrapper")
  // _groups is important in this

  // add svg element using "append"
  // 1.2) const svg = wrapper.append("svg")

  // determine size of svg w/ ".attr()"
  // first arg = name
  // second arg = value
  // 1.3) svg.attr("width", dimensions.width)
  // 1.4) svg.attr("height", dimesions.height)

  // d3-selection return a selection obj
  // any mthd that selects/creates a new obj -> return new selection
  // any mthd that manips current selec -> return same selection
  // 1.1-1.4 above can be rewritten as:
  d3.select(".vis-linechart2 > *").remove();

  const svg = d3
    //.select("#wrapper")
    .select(".vis-linechart2")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g");
};

export default drawlinechart;
