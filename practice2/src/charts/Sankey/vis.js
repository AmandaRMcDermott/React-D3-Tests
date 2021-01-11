import * as d3 from "d3";
import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  var units = "Widgets";
  // Dimensions
  var w = 960,
    h = 400;

  var margin = { top: 10, right: 10, bottom: 10, left: 25 },
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

  // format variables
  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    },
    color = d3.scaleOrdinal(d3.schemeSet3);

  // append the svg object to the body of the page
  d3.select(".vis-sankey > *").remove();

  // SVG Canvas
  const svg = d3
    .select(".vis_sankey")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = Sankey().nodeWidth(20).nodePadding(40).size([width, height]);

  var path = sankeyLinkHorizontal();

  // for gradient coloring
  var defs = svg.append("defs");

  // Read data

  // Define graph
  const graph = { nodes: [], links: [] };

  // Arrange .csv data file
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
      })
      .object(graph.nodes)
  );

  // Properties for nodes to keep track of whether they are collapsed and how many of their parent nodes are collapsed
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { name: d };
    graph.nodes[i].collapsing = 0; // count of collapsed parent nodes
    graph.nodes[i].collapsed = false;
    graph.nodes[i].collapsible = false;
  });

  // links point to the whole source or target node rather than the index because we need the source nodes for filtering.
  //I also set all target nodes are collapsible.
 /*
  graph.links.forEach(function (e) {
    e.source = graph.nodes.filter(function (n) {
      return n.name === e.source;
    })[0];
  });
  graph.links.forEach(function (e) {
    e.target = graph.nodes.filter(function (n) {
      return n.name === e.target;
    })[0];
  });
  graph.links.forEach(function (e) {
    e.target.collapsible = true;
  });
*/
  sankey(graph);

  var nodes, links;
  //const node = graph.nodes.filter(function (d) {
  //  return d.collapseing === 0;
  //});
  /*
  function update2() {
    nodes = graph.nodes.filter(function (d) {
      // return nodes with no collapsed parent nodes
      return d.collapsing === 0;
    });

    links = graph.links.filter(function (d) {
      // return only links where source and target are visible
      return d.source.collapsing === 0 && d.target.collapsing === 0;
    });

    // Sankey properties
    sankey(graph);
    //sankey.nodes(nodes).links(links).layout(32);

    // I need to call the function that renders the sankey, remove and call it again,
    // or the gradient coloring doesn't apply (I don't know why)
    sankeyGen();
    svg.selectAll("g").remove();
    update2();
    //sankey.layout(32);
    sankeyGen();
  }
*/
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
  console.log(graph)
};

export default drawsankey;
