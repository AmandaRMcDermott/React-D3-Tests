import * as d3 from "d3";
//import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _ from "lodash";
import { sankey } from "../Sankey/Helpers";

const drawsankey = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  var units = "Widgets";

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
  d3.select(".vis-sankey2 > *").remove();

  // SVG Canvas
  var svg = d3
    .select(".vis-sankey2")
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

  update();
  var nodes, links;
  //console.log(graph);

  function update2() {
    update();
    var nodes = d3
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
  }

  function update() {
    nodes = graph.nodes.filter(function (d) {
      // return nodes with no collapsed parent nodes
      return d.collapsing == 0;
    });

    links = graph.links.filter(function (d) {
      // return only links where source and target are visible
      return d.source.collapsing == 0 && d.target.collapsing == 0;
    });

    svg.selectAll("g").remove();

    // Sankey properties
    //sankeyGen();
    Sankey.nodes(nodes).links(links).layout(32);

    // I need to call the function that renders the sankey, remove and call it again,
    // or the gradient coloring doesn't apply (I don't know why)

    //sankeyGen();

    Sankey.align("left").layout(32);

    sankeyGen();
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
    var node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", function (d) {
        return "node " + d.name;
      })
      //.transition().duration(500)
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
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
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
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

    node.on("click", click);
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
              console.log(l.target);
            }
          });
        }
        console.log(d.collapsed);
        d.collapsed = !d.collapsed; // toggle state of node
        console.log(d.collapsed);
      }
      update();
    }
  }
};

export default drawsankey;
