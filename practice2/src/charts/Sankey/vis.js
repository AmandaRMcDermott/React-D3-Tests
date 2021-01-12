import * as d3 from "d3";
import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  const units = "Widgets";

  // Dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15, // small top
      right: 15, // small right to give the chart space
      bottom: 100, // larger bottom for axes
      left: 40, // larger left for axes
    },
  };
  // size of the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // format variables
  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    },
    color = d3.scaleOrdinal(d3.schemeSet3);

  // append the svg object to the body of the page
  d3.select(".vis-sankey > *").remove();

  // append the svg object to the body of the page
  d3.select(".vis-sankey > *").remove();
  const svg = d3
    .select(".vis-sankey")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + " ," + dimensions.margin.top + ")"
    );

    const sankey = Sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([dimensions.width, dimensions.height])


  
  const  path = sankeyLinkHorizontal();

  const graph = { nodes: [], links: [] };
  console.log(graph)
  // Read data
  // Arrange .csv data file
  data.forEach(function (d) {
    graph.nodes.push({ name: d.source });
    graph.nodes.push({ name: d.target });
    graph.links.push({ source: d.source, target: d.target, value: +d.value });
  });
console.log(graph)
  // return only the distinct / unique nodes
  graph.nodes = d3.keys(
    d3
      .nest()
      .key(function (d) {
        return d.name;
      })
      .object(graph.nodes)
  );

  graph.links.forEach(function (d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });
  console.log(graph);
  // loop through each node to make nodes an array of objects instead of an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { name: d };
  });
  // Properties for nodes to keep track of whether they are collapsed and how many of their parent nodes are collapsed
  graph.nodes.forEach(function (d, i) {
    //graph.nodes[i] = { name: d };
    graph.nodes[i].collapsing = 0; // count of collapsed parent nodes
    graph.nodes[i].collapsed = false;
    graph.nodes[i].collapsible = false;
  });

  sankey(graph);
  
  //console.log(graph);

  const link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", sankeyLinkHorizontal())
    //.attr("stroke-width", function (d) { return d.width; }) // v1 - // Controls width of links
    .attr("stroke-width", function (d) {
      return Math.max(1, d.y0);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  // add the link titles
  link.append("title").text(function (d) {
    return d.source.name + " -> " + d.target.name + "\n" + format(d.value);
  });

  // add the nodes
  const node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node");
console.log(graph)
  // Add the rectangles for the nodes
  node
  .append("rect")
  .join("rect")
  .attr("x", (d) => d.x0)
  .attr("y", (d) => d.y0)
  .attr('height', function(d) { return d.y1 - d.y0})
  //.attr("height", (d) => d.y0 - 0)
  .attr("width", (d) => d.x1 - d.x0)
  .style("fill", function (d) {
    return (d.color = color(d.name.replace(/ .*/, "")));
  })
  .append("title")
  .text(function (d) {
    return d.name + "\n" + format(d.value);
  });

  // add titles to the node
  node
    //.append("text")
    //.selectAll("text")
    .append("text")
    .attr("font-size", 10)
    //.attr("x", -6)
    //.attr("y", function (d) {  return d.dy / 2;})
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("transform", "end")
    .attr("transform", null)
    .text(function (d) {
      return d.name;
    })
    //.filter(function (d) {return d.x < dimensions.width / 2;})
    .attr("x", (d) => (d.x0 < dimensions.width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) =>
      d.x0 < dimensions.width / 2 ? "start" : "end"
    );

  //link.attr("d", sankeyLinkHorizontal);
};

export default drawsankey;
