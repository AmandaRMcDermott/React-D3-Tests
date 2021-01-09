import * as d3 from "d3";
import _ from "lodash";
//import sankey from "d3-plugins-sankey";
//import * as d3Sankey from "d3-sankey";
//import { sankey, sankeyLinkHorizontal } from "d3-sankey";
//import { format, linkHorizontal } from "d3";
import { getKeyThenIncreaseKey } from "antd/lib/message";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }
  d3.sankey;
  console.log(data);

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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
  });
};

export default drawsankey;
