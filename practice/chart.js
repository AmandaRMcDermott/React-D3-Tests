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
  const dataset = await d3.json("./nyc_weather_data.json");

  //console.log(dataset);
  console.table(dataset[0]);

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
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // console shows svg is now linked to wrapper
  // default size is 300x150
  //console.log(wrapper)

  // creating bounding box
  // create group that shifts contents to respect top and left margins
  // need to use svg elements to work inside svg element, lets use "g"
  // using ".style()" for adding and modifying css styles
  // takes key-value pair as first and second args
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // under "Elements" -> "svg" -> "g" appears

  // create scales
  // plotting the data's range reqs converting them into pixel space
  // can do this using "d3-scale", a func that converts values btw 2 domains
  // needs the domain (min and max input vals)
  // needs the range (min and max output vals)
  // use d3-array's "d3.extent()"
  // first arg: array of data pts
  // second arg: accessor func defaults to an identity func (d => d)
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    // dimensions.boundedHeight = highest val
    .range([dimensions.boundedHeight, 0]);

  //console.log(yScale(32))

  const freezingTemperaturePlacement = yScale(30);
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3");

  // x-Axis
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d))) // finds scaled x vals
    .y((d) => yScale(yAccessor(d))); // finds scaled y vals

  const line = bounds
    .append("path")
    // feed dataset
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none") // do not fill
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2);

  // draw axes
  const yAxisGenerator = d3.axisLeft().scale(yScale);

  // create "g" element to hold all yaxis elements
  // use ".call()" to
  // 1) prevent saving selection as a var
  // 2) preserve selection for additional chaining
  const yAxis = bounds.append("g").attr("class", "y-axis").call(yAxisGenerator);

  // y-axis label
  const yAxisLabel = yAxis
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left / 1.5)
    .html("Max. Temperature (&deg;F)");

  // make xaxis
  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  // make listening rectangle
  const listeningRect = bounds
    .append("rect")
    .attr("class", "listening-rect")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave);

  // tooltip
  const tooltip = d3.select("#tooltip");

  // appending a circle to make it more clear which part is hovered over
  const tooltipCircle = bounds
    .append("circle")
    .attr("class", "tooltip-circle")
    .attr("r", 4)
    .attr("fill", "white")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2)
    .style("opacity", 0);

  function onMouseMove() {
    const mousePosition = d3.mouse(this);
    //console.log(mousePosition[0]);

    // ".invert()" converts units -> range to the domain
    const hoveredDate = xScale.invert(mousePosition[0]);
    //console.log(hoveredDate);

    // get closest data point
    // "d3.scan()" takes 2 adjacent items in an array and returns numerical vaue
    // 2 args:
    // 1) an array (the dataset)
    // 2) optionl comparator func
    // first find dist bwt hovered pt and dataset (in abs terms)
    const getDistanceFromHoveredDate = (d) =>
      Math.abs(xAccessor(d) - hoveredDate);

    // then compare the two data points using "d3.scan()" comaprator func
    // creates an array of dist from the hovered pt -> can then find smallest dist
    const closestIndex = d3.scan(
      dataset,
      (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    );

    // grab closest datapt
    const closestDataPoint = dataset[closestIndex];
    const closestXValue = xAccessor(closestDataPoint);
    const closestYValue = yAccessor(closestDataPoint);
    //console.log(dataset[0]);

    // format date
    const formatDate = d3.timeFormat("%B %A %-d, %Y");
    tooltip.select("#date").text(formatDate(closestXValue));

    // format temp
    const formatTemperature = (d) => `${d3.format(".1f")(d)}&deg;F`;
    tooltip
      .select("#temperature")
      // html ensures degrees is formatted properly
      .html(formatTemperature(closestYValue));

    // for the circle
    tooltipCircle
      .attr("cx", xScale(closestXValue))
      .attr("cy", yScale(closestYValue))
      .style("opacity", 1);

    // grab x and y pos
    const x = xScale(closestXValue) + dimensions.margin.left;
    const y = yScale(closestYValue) + dimensions.margin.top;

    tooltip.style(
      "transform",
      `translate(` + `calc( -50% + ${x}px),` + `calc(-100% + ${y}px)` + `)`
    );

    tooltip.style("opacity", 1);
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0);
    tooltipCircle.style("opacity", 0);
  }
};

drawLineChart();
