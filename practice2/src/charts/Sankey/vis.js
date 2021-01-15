import * as d3 from "d3";
//import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";
import { sankey } from "./Helpers";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  var units = "Widgets";
  var duration = 0;

  let dimensions = {
    width: window.innerWidth * 0.8,
    height: 550,
    margin: {
      top: 1, // small top
      right: 1, // small right to give the chart space
      bottom: 10, // larger bottom for axes
      left: 150, // larger left for axes
    },
  };
  // size of the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  var resetSizeDown = function () {
    d3.select("svg")
      .transition()
      .duration(duration)
      .attr("height", dimensions.boundedHeight);
    svg.attr("height", 700);
    sankey.size([dimensions.width, dimensions.height]);
  };

  // format variables

  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    },
    color = d3.scaleOrdinal(d3.schemeSet3);

  // append the svg object to the body of the page
  d3.select(".vis-sankey > *").remove();

  // SVG Canvas
  var svg = d3
    .select(".vis-sankey")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .attr("class", "plot")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    )
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  var linkset = svg.append("g").attr("id", "linkSet")
  console.log(linkset)
  // for gradient coloring
  var defs = svg.append("defs");


  //// RELAYOUT
  var redraw = function(maindata, filter) {

    // test this later
    filter = filter || function() { return true; }

    var data = maindata.filter(filter);

    var graph = formatData(data)

  // make the sankey data
  var Sankey = sankey()
  .nodeWidth(20)
  .nodePadding(40)
  .size([dimensions.width - 200, dimensions.height])
  .align("left");

  var path = Sankey.link();

  /// linkColor
  var link = linkset.selectAll(".link").data(graph.links, function(d){
    return d.source.name + "-" + d.target.name
  })

  link
  .enter()
  .append("path")
  //.style("stroke", function (d) {return linkColor(d.diff);})
  .attr("class", "link")
  .attr("d", function (d) {
    try {
      return path(defaultPath);
    } catch (e) {
      return path(d);
    }
  })

  link 
    .transition()
    .duration(duration)
    .style("opacity", 0.9)
    .attr("d", path)
    .style("stroke-width", function(d) {
      return Math.max(1, d.dy);
    })
    //.sort(function (a, b) {return b.dy - a.dy})

  link.exit().remove();

  // Add in the nodes
  var node = svg.selectAll(".node").data(graph.nodes, function(d) {
    return d.name
  })

  var entering = node.enter().append("g")

  entering 
    .attr("transform", function(d) {
      try {
        d.relative =
          defaultPath.source.x === d.x ? defaultPath.source : defaultPath.target;
      } catch (error) {
        d.relative = d;
      }
      return "translate(" + d.x + "," + d.relative.y + ")";
    })
    .attr("class", "node");

  entering
    .append("rect")
    .on("click", function (d) {
      resetSizeDown();
      defaultPath = link
        .filter(function (e) {
          return e.source.name == d.name || e.target.name == d.name;
        })
        .datum();

      redraw(
        maindata,
        (filter = function (e) {
          var remainingNodes = [],
            nextNodes = [],
            allLinks = [];

          var traverse = [
            {
              linkType: "sourceLinks",
              nodeType: "target",
            },
            {
              linkType: "targetLinks",
              nodeType: "source",
            },
          ];

          traverse.forEach(function (step) {
            d[step.linkType].forEach(function (link) {
              remainingNodes.push(link[step.nodeType]);
              allLinks.push(link[step.nodeType].name);
            });

            while (remainingNodes.length) {
              nextNodes = [];
              remainingNodes.forEach(function (node) {
                node[step.linkType].forEach(function (link) {
                  nextNodes.push(link[step.nodeType]);
                  allLinks.push(link[step.nodeType].name);
                });
              });
              remainingNodes = nextNodes;
            }
          });

          var nodeNames = d3.keys(
            d3
              .nest()
              .key(function (d) {
                return d;
              })
              .map(allLinks)
          );

          // when changing from 'i' to 'F1-' must address substring as well

          // intended is clicked
          if (d.name.substring(0, 1) == "1") {
            return (
              e.source == d.name ||
              (e.target ==
                (nodeNames.indexOf(e.target) > -1
                  ? nodeNames[nodeNames.indexOf(e.target)]
                  : "") &&
                e.source ==
                  (nodeNames.indexOf(e.source) > -1
                    ? nodeNames[nodeNames.indexOf(e.source)]
                    : ""))
            );
          }

          // declared is clicked
          if (d.name.substring(0, 1) == "2") {
            return e.target == d.name || e.source == d.name;
          }

          // degree is clicked
          if (d.name.substring(0, 1) == "3" || d.name.substring(0, 1) == "1") {
            return (
              e.target == d.name ||
              (e.source ==
                (nodeNames.indexOf(e.source) > -1
                  ? nodeNames[nodeNames.indexOf(e.source)]
                  : "") &&
                e.target ==
                  (nodeNames.indexOf(e.target) > -1
                    ? nodeNames[nodeNames.indexOf(e.target)]
                    : ""))
            );
          }
        })
      );
    })
    // d.name.substring(4,2, colors each box by values of 3rd and 4th char (college abbrev);
    // return d.color = color(d.name.replace(/ .*/, "")); })
    .style("stroke", function (d) {
      return d3.rgb(d.color).darker(2);
    })
    .attr("height", function (d) {
      return d.relative.dy;
    })
    .style("opacity", 0);
  /* RESET CANVAS SIZE */
  var resetSizeDown = function () {
    d3.select("svg")
      .transition()
      .duration(duration)
      .attr("height", dimensions.boundedHeight);
    svg.attr("height", 700);
    Sankey.size([dimensions.width, dimensions.height]);
  };

  duration = 7000;

  }

  redraw(data,
    (filter = function (d) {
    return true;
  }));

  // for gradient coloring
  //var defs = svg.append("defs");






  /* FORMAT DATA */
  function formatData(data) {
    // Read data
    // Define graph
    var graph = { nodes: [], links: [] };
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
  graph.links.forEach(function (e) {
    e.source = graph.nodes.filter(function (n) {
      return n.name === e.source;
    })[0];
    e.target = graph.nodes.filter(function (n) {
      return n.name === e.target;
    })[0];
    e.target.collapsible = true;
  });
  return graph;

  };

  /* RESET CANVAS SIZE */
  var resetSizeDown = function () {
    d3.select("svg")
      .transition()
      .duration(duration)
      .attr("height", dimensions.boundedHeight);
    svg.attr("height", 700);
    sankey.size([dimensions.width, dimensions.height]);
  };




  ////Sankey.nodes(graph.nodes).links(graph.links).layout(32);
  ////update();
  ////sankeyGen();
  var nodes, links, nodesRemove;
  var defaultPath = { x: 0 };
  //console.log(graph);

  /*
  function update2() {
    update();
    svg.selectAll("g").remove();

    var node = d3
      .selectAll(".node")
      .transition()
      .duration(750)
      .attr("opacity", 1.0)
      .attr("transform", function (d) {
        if (d.node == 3) {
          console(d.x, d.y);
        }
        return "translate(" + d.x + "," + d.y + ")";
      });

    var links = d3
      .selectAll(".link")
      .transition()
      .duration(950)
      .attr("d", path)
      .attr("opacity", 1.0);

    //sankeyGen();
  }


  function update() {
    //Sankey.nodes(graph.nodes).links(graph.links).layout(32);

    nodes = graph.nodes.filter(function (d) {
      // return nodes with no collapsed parent nodes
      return d.collapsing == 0;
    });
    nodesRemove = graph.nodes.filter(function (d) {
      // return nodes with no collapsed parent nodes
      return d.collapsing == 1;
    });
    //console.log(nodes)
    links = graph.links.filter(function (d) {
      // return only links where source and target are visible
      return d.source.collapsing == 0 && d.target.collapsing == 0;
    });

    console.log("Show", nodes);
    console.log("Hide", nodesRemove);
    //var node = d3.selectAll(".node");

    // Sankey properties
    //sankeyGen();
    Sankey.nodes(nodes).links(links).layout(32);

    // I need to call the function that renders the sankey, remove and call it again,
    // or the gradient coloring doesn't apply (I don't know why)

    //sankeyGen();

    ////Sankey.align("left").layout(32);
    ////svg.selectAll("g").remove();
    sankeyGen();
    //svg.selectAll(".node").remove();
  }
  */
  /* GENERATE THE GRADIENTS */

  

};

export default drawsankey;
