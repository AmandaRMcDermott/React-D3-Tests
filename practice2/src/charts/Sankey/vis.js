import * as d3 from "d3";
import _ from "lodash";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }
  console.log(data);

  var units = "Widgets";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // format variables
  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    },
    color = d3.scaleOrdinal(d3.schemeCategory10);

  // append the svg object to the body of the page
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the sankey diagram properties
  var sankey = sankey().nodeWidth(36).nodePadding(40).size([width, height]);

  var path = sankey.link();

  //set up graph in same style as original example but empty
};

export default drawsankey;
