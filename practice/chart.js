//import * as d3 from "d3";
//import React from 'react';
//import ReactDOM from 'react-dom';
//import '../src/index.css';
//import App from './App';
//import reportWebVitals from './reportWebVitals';

const drawLineChart = async () => {
  //write your code here

  // 1. access the data
  // await is a S keyword that will PAUSE THE EXEC OF A FUNC
  // UNTIL A PROMISE IS RESOLVED (only works with async)
  // just means any code (w/i func) will wait to run until data is defined
  const dataset = await d3.json("./my_weather_data.json");

  //console.log(dataset);
  console.table(dataset[0])

  // create a yAccessor for plotting y-axis pts
  const yAccessor = (d) => d.temperatureMax;
  
  // xAccessor
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);
  
  // Drawing the Chart

  // wrapper - contains the entire chart (data elements, axes, labels)
  // bounds - contains all data elements (line)


}

drawLineChart();