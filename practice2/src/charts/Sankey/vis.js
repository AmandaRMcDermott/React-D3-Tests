import * as d3 from "d3";
import _ from "lodash";
//import * as sankey from "d3-sankey";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { format, linkHorizontal } from "d3";
import { getKeyThenIncreaseKey } from "antd/lib/message";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }
  console.log(data);

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

  const units = "Widgets";

  // format variables
  const formatNumber = d3.format(",.0f"), // zero decimal places
    formet = function (d) {
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
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const sankeyplot = sankey();

  sankeyplot
    .nodeWidth(36)
    .nodePadding(40)
    .size([dimensions.width, dimensions.height]);

  //const path = sankeyLinkHorizontal;
  //  console.log(path)
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

  //sankey.nodes(graph.nodes).links(graph.links).layout(32);
  const testfuc = function source(d) {
    return [d.source.x1, d.y0];
  };
  console.log(testfuc(graph.links));
  // add in the links
  /*
  const link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });
    */
  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
    .selectAll("path")
    .data(graph.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", function (d) {
      return d.width;
    });
  console.log(link);
  // add the link titles
  link.append("title").text(function (d) {
    //return d.source + " [] " + d.target + "\n" + format(d.value);
    //return format(d.value);
    console.log(d.source);
  });

  //console.log(link);

  const node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(
      d3
        .drag()
        .subject(function (d) {
          return d;
        })
        .on("start", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
    );

  node
    .append("rect")
    .attr("height", function (d) {
      return data.dy;
    })
    .attr("width", sankey.nodeWidth)
    .style("fill", function (d) {
      return (d.color = color(d.name.replace(/ .*/, "")));
    })
    .append("title");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr(
      "transform",
      "translate(" +
        d.x +
        "," +
        (d.y = Math.max(0, Math.min(dimensions.height - d.dy, d3.event.y))) +
        ")"
    );
    sankey.relayout();
    //link.attr("d", sankeyLinkHorizontal);
  }
};

export default drawsankey;
