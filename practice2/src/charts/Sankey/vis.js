import * as d3 from "d3";
import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";
//import sankey from "d3-plugins-sankey";
//import * as d3Sankey from "d3-sankey";
//import { sankey, sankeyLinkHorizontal } from "d3-sankey";
//import { format, linkHorizontal } from "d3";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  console.log(data);

  let dimensions = {
    width: window.innerWidth * 0.8,
    height: 400,
    margin: {
      top: 10, // small top
      right: 10, // small right to give the chart space
      bottom: 20, // larger bottom for axes
      left: 10, // larger left for axes
    },
  };
  // size of the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const units = "Widgets";

  // format variables
  const formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    },
    color = d3.scaleOrdinal(d3.schemeCategory10);

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
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    );

  const sankey = Sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([dimensions.width, dimensions.height]);

  //const path = sankey.link();

  /*  
  const svg = d3
    .select(".vis-sankey")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );
*/

  const graph = { nodes: [], links: [] };

  data.forEach(function (d) {
    graph.nodes.push({ name: d.source });
    graph.nodes.push({ name: d.target });
    graph.links.push({ source: d.source, target: d.target, value: +d.value });
  });

  // return only the distinct / unique nodes
  graph.nodes = d3.keys(
    d3
      .nest()
      .key(function (d) {
        return d.name;
        //console.log(d.name);
      })
      .object(graph.nodes)
  );

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });

  //console.log(graph.nodes)
  // loop through each node to make nodes an array of objects instead of an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { name: d };
    //console.log(graph.nodes);
  });

  sankey(graph);

  //sankey.nodes(graph.nodes).links(graph.links).layout(32);

  const link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    //.attr("fill", "none")
    //.attr("stroke", "#000")
    //.attr("stroke-opacity", 0.2)
    //.selectAll("path")
    //.data(graph.links)
    .enter()
    .append("path")
    //.join("path")
    .attr("class", "link")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", function (d) {
      return d.width;
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
  //.attr("transform", function (d) {
  //  return "translate(" + (d.x1 - d.x0) + "," + (d.y1 - d.y0) + ")";
  //});

  node
    .append("rect")
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .style("fill", function (d) {
      return (d.color = color(d.name.replace(/ .*/, "")));
    })
    .append("title")
    .text(function (d) {
      return d.name + "\n" + format(d.value);
    });

  link.attr("d", sankeyLinkHorizontal());
  //link.attr("d", sankeyLinkHorizontal);
};

export default drawsankey;
