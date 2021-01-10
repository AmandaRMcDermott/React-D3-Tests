import * as d3 from "d3";
import _ from "lodash";

const draw = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data.activities);
  }

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15, // small top
      right: 15, // small right to give the chart space
      bottom: 30, // larger bottom for axes
      left: 40, // larger left for axes
    },
  };
  // size of the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  d3.select(".vis-linechart > *").remove();

  let svg = d3
    .select(".vis-linechart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );
  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function (d) {
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
    d.count = +d.count;
  });

  // Add X axis --> it is a date format
  let x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, dimensions.boundedWidth]);
  svg
    .append("g")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    //.attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.count;
      }),
    ])
    .range([dimensions.boundedHeight, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.count);
        })
    );
};

export default draw;
