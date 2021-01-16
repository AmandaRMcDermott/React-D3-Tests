import * as d3 from "d3";
//import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";
import { sankey } from "./Helpers";
//import { quantileSorted, threshold } from "d3-array";

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
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    )
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  svg
    .append("rect")
    .attr("class", "background")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);
  //.on("click", document.location.reload());

  var linkset = svg.append("g").attr("id", "linkSet");
  //console.log(linkset);

  // the names of the columns that are used in the sankey
  var nodeLabel = ["targetDiv", "sourceDiv"];
  var nodeNames = ["target", "source"];
  var countName = "value";
  var lastData = [];

  var defaultPath = { x: 0 };

  // for gradient coloring
  var defs = svg.append("defs");

  //// RELAYOUT
  var redraw = function (maindata, filter) {
    // test this later
    filter =
      filter ||
      function () {
        return true;
      };

    var data = maindata.filter(filter);

    var graph = formatData(data);
    //console.log(graph);
    // make the sankey data
    var Sankey = sankey()
      .nodeWidth(20)
      .nodePadding(40)
      .size([dimensions.width - 200, dimensions.height])
      .align("left");

    Sankey.nodes(graph.nodes).links(graph.links).layout(32);

    var path = Sankey.link();

    /// linkColor
    var link = linkset.selectAll(".link").data(graph.links, function (d) {
      return d.source.name + "-" + d.target.name;
    });

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
      });

    link
      .transition()
      .duration(duration)
      .style("opacity", 0.9)
      .attr("d", path)
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      });
    //.sort(function (a, b) {return b.dy - a.dy})

    link.exit().remove();
    console.log(link);
    // Add in the nodes
    var node = svg.selectAll(".node").data(graph.nodes, function (d) {
      return d.name;
    });

    var entering = node.enter().append("g");

    entering
      .attr("transform", function (d) {
        try {
          d.relative =
            defaultPath.source.x === d.x
              ? defaultPath.source
              : defaultPath.target;
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
            if (
              d.name.substring(0, 1) == "3" ||
              d.name.substring(0, 1) == "1"
            ) {
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
      .style("fill", function (d) {
        return (d.color = color(d.name.replace(/ .*/, "")));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .attr("height", function (d) {
        return d.relative.dy;
        console.log(d.relative.dy);
      })
      .style("opacity", 0);

    entering
      .append("text")
      .attr("class", "label")
      .attr("x", -6)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < dimensions.width / 2;
      })
      .attr("x", 6 + Sankey.nodeWidth())
      .attr("text-anchor", "start");

    node
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // Add the node rectangles
    node
      .selectAll("rect")
      .transition()
      .duration(duration)
      .style("opacity", 1)
      .attr("height", function (d) {
        return d3.max([2, this.parentNode.__data__.dy]);
        //console.log(d3.max([2, this.parentNode.__data__.dy]));
      })
      .attr("width", Sankey.nodeWidth());

    d3.selectAll("text.label")
      .transition()
      .duration(duration)
      .attr("y", function (d) {
        return this.parentNode.__data__.dy / 2;
      });

    node.exit().remove();

    var starts = d3.set(
      data.map(function (d) {
        return d.source.substring(4, 1, d.source.length);
      })
    );

    var colors = d3.scaleOrdinal(d3.schemeSet3);

    redraw(data, function (d) {
      return true;
    });

    redraw(data);

    console.log(redraw(data));

    // for gradient coloring
    //var defs = svg.append("defs");

    function reloadPage() {
      document.location.reload();
    }

    /* FORMAT DATA */
    function formatData(data) {
      // Read data
      // Define graph
      var graph = { nodes: [], links: [] };
      // Arrange .csv data file
      data.forEach(function (d) {
        graph.nodes.push({ label: d.sourceDiv });
        graph.nodes.push({ label: d.targetDiv });
        graph.nodes.push({ name: d.source });
        graph.nodes.push({ name: d.target });
        graph.links.push({
          source: d.source,
          target: d.target,
          value: +d.value,
        });
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
      //console.log(graph.links[0]);
      //now loop through each node to make nodes an array of objects
      // rather than an array of strings
      graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = { name: d };
      });
      /*
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
    */

      return graph;
    }

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
    //var nodes, links, nodesRemove;

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
};

export default drawsankey;
