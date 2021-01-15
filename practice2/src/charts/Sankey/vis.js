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

  var Sankey = sankey()
    .nodeWidth(20)
    .nodePadding(40)
    .size([dimensions.width - 200, dimensions.height])
    .align("left");

  var path = Sankey.link();

  // for gradient coloring
  var defs = svg.append("defs");

  // for gradient coloring
  //var defs = svg.append("defs");

  var graph;

  // Read data
  // Define graph
  graph = { nodes: [], links: [] };
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

  ////Sankey.nodes(graph.nodes).links(graph.links).layout(32);
  update();
  sankeyGen();
  var nodes, links, nodesRemove;
  var defaultPath = { x: 0 };
  //console.log(graph);

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

  /* GENERATE THE GRADIENTS */

  function sankeyGen() {
    /* function that will create a unique id for your gradient from a link data object.
    It's also a good idea to give a name to the function for determining node colour */
    // define utility functions
    function getGradID(d) {
      return "linkGrad-" + d.source.name + "-" + d.target.name;
    }
    function nodeColor(d) {
      return (d.color = color(d.name.replace(/ .*/, "")));
    }

    // create gradients for the links
    var grads = defs.selectAll("linearGradient").data(links, getGradID);

    grads
      .enter()
      .append("linearGradient")
      .attr("id", getGradID)
      .attr("gradientUnits", "userSpaceOnUse");

    function positionGrads() {
      grads
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
    }
    positionGrads();

    grads
      .html("") //erase any existing <stop> elements on update
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", function (d) {
        return nodeColor(+d.source.x <= +d.target.x ? d.source : d.target);
      });

    grads
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function (d) {
        return nodeColor(+d.source.x > +d.target.x ? d.source : d.target);
      });

    //////////////////////////////////////////////////////////////////////
    //
    ////// LINKS //////
    //
    // ENTER the links
    //console.log(links);
    var link = svg
      .append("g")
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", path)
      /*.style("stroke", function (d) {
        return "url(#" + getGradID(d) + ")";
      })*/
      //.style("stroke", function(d) {
      //	return d.source.color;
      //})
      //.style("stroke", "#3f51b5")
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });

    // add the link titles
    link.append("title").text(function (d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

    ////// NODES //////
    //
    // ENTER the nodes
    /*
    var node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", function (d) {
        return "node " + d.name;
      })
      .attr("visibility", function (d) {
        return d.collapsing;
      })
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
*/

    var node = svg.selectAll(".node").data(graph.nodes, function (d) {
      return d.name;
    });

    var entering = node.enter().append("g");

    entering
      .attr("transform", function (d) {
        try {
          d.relative =
            defaultPath.parent.x === d.x
              ? defaultPath.parent
              : defaultPath.child;
        } catch (error) {
          d.relative = d;
        }
        return "translate(" + d.x + "," + d.relative.y + ")";
      })
      .attr("class", "node");

    entering.append("title").append("text");

    entering
      .append("rect")
      .on("click", function (d) {
        resetSizeDown();
        defaultPath = link
          .filter(function (e) {
            return e.parent.name == d.name || e.child.name == d.name;
          })
          .datum();

        relayout(
          maindata,
          (filter = function (e) {
            var remainingNodes = [],
              nextNodes = [],
              allLinks = [];

            var traverse = [
              {
                linkType: "parentLinks",
                nodeType: "child",
              },
              {
                linkType: "childLinks",
                nodeType: "parent",
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
                e.parent == d.name ||
                (e.child ==
                  (nodeNames.indexOf(e.child) > -1
                    ? nodeNames[nodeNames.indexOf(e.child)]
                    : "") &&
                  e.parent ==
                    (nodeNames.indexOf(e.parent) > -1
                      ? nodeNames[nodeNames.indexOf(e.parent)]
                      : ""))
              );
            }

            // declared is clicked
            if (d.name.substring(0, 1) == "2") {
              return e.child == d.name || e.parent == d.name;
            }

            // degree is clicked
            if (
              d.name.substring(0, 1) == "3" ||
              d.name.substring(0, 1) == "1"
            ) {
              return (
                e.child == d.name ||
                (e.parent ==
                  (nodeNames.indexOf(e.parent) > -1
                    ? nodeNames[nodeNames.indexOf(e.parent)]
                    : "") &&
                  e.child ==
                    (nodeNames.indexOf(e.child) > -1
                      ? nodeNames[nodeNames.indexOf(e.child)]
                      : ""))
              );
            }
          })
        );
      })
      .style("fill", function (d) {
        return (d.color = divisionColors(
          d.name.substring(5, 2, d.name.length)
        ));
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
    /*
    //// Drag the nodes ////
    .call(d3.drag()
              .subject(function(d) { return d; })
              .on("start", function() { this.parentNode.appendChild(this);})
              .on("drag", dragmove)
            );
*/
    // add the rectangles for the nodes
    node
      .append("rect")
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", Sankey.nodeWidth())
      .style("fill", function (d) {
        return (d.color = color(d.name.replace(/ .*/, "")));
      })
      .style("stroke", function (d) {
        return color(d.name.replace(/ .*/, ""));
        //	return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function (d) {
        return d.name + "\n" + format(d.value);
      });

    // Scale for text
    var graphValues = new Array(nodes.length - 1);
    for (var i = 0; i <= nodes.length - 1; i++) {
      graphValues[i] = nodes[i].value;
    }
    var textScale = d3
      .scaleLinear()
      .domain([d3.min(graphValues), d3.max(graphValues)])
      .range([10, 20]);

    // add in the title for the nodes
    node
      .append("text")
      .style("font-size", function (d) {
        return textScale(d.value);
      })
      .style("font-family", "Helvetica")
      .attr("x", -6)
      .attr("y", function (d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      // Selects the main node
      .filter(function (d) {
        return d.x < 1;
      })
      .attr("x", function (d) {
        return -d.dy / 6;
      })
      .attr("y", -5)
      .attr("text-anchor", "middle");

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this)
        .transition()
        .duration(250)
        .attr(
          "transform",
          "translate(" +
            d.x +
            "," +
            (d.y = Math.max(
              0,
              Math.min(dimensions.height - d.dy, d3.event.y)
            )) +
            ")"
        );
      //Sankey.relayout();
      link.attr("d", path);
    }

    /* If node is clicked, update it collapse values */
    node.on("click", click);

    /* CLICK FUNCTION */
    function click(d) {
      if (d3.event.defaultPrevented) return;
      if (d.collapsible) {
        // If it was visible, it will become collapsed so we should decrement child nodes count
        // If it was collapsed, it will become visible so we should increment child nodes count
        var inc = d.collapsed ? -1 : 1;
        recurse(d);

        function recurse(sourceNode) {
          //check if link is from this node, and if so, collapse
          graph.links.forEach(function (l) {
            if (l.source.name === sourceNode.name) {
              l.target.collapsing += inc;
              recurse(l.target);
            }
          });
        }
        d.collapsed = !d.collapsed; // toggle state of node
      }

      /* Update with new nodes and links */
      update();
    }

    //update2();
  }
};

export default drawsankey;
