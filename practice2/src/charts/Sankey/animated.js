var duration = 0;
var units = "Students";

var margin = { top: 10, right: 200, bottom: 30, left: 50 };

// change in margine value (increase as negative moves the columns closer together
var width = window.innerWidth - margin.left - margin.right - 50;
// var width = 700;

// change here affects the graphic height, not the canvas.  default was 800, change to 400 does not increase the canvas
var height = 800;

var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function (d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg
  .append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", reloadPage);

var linkset = svg.append("g").attr("id", "linkSet");
// Set the sankey diagram properties
var state;

//the names of the columns that will be used in the Sankey.

var nodeLabels = ["childDiv", "parentDiv"]; // Mark added this line;
var nodeNames = ["child", "parent"];
var countName = "value";
var lastData = [];

defaultPath = { x: 0 };

var relayout = function (maindata, filter) {
  filter =
    filter ||
    function () {
      return true;
    };
  var data = maindata.filter(filter);
  //dat = data
  //Drop the exiting selections from last time

  var graph = dataToNodeList(data);

  //here it goes.

  //make the new data frame

  var sankey = d3.sankey().nodeWidth(42).nodePadding(8).size([width, height]);

  sankey.nodes(graph.nodes).links(graph.links).layout(12);

  path = sankey.link();

  linkColor = d3.scale
    .log()
    .domain([0.1, 1, 10])
    .range(["red", "grey", "blue"]);

  //add in the links. changing 'height' below reduces the amount of spread, allowing the detail chart to fit
  // default height was 800, 750 clippped the bottom og the graph, things appear to fit at 700

  var link = linkset.selectAll(".link").data(graph.links, function (d) {
    return d.parent.name + "-" + d.child.name;
  });

  var resetSizeDown = function () {
    height = 700;
    d3.select("svg")
      .transition()
      .duration(duration)
      .attr("height", window.innerHeight);
    svg.attr("height", 700);
    sankey.size([width, height]);
  };

  link
    .enter()
    .append("path")
    .style("stroke", function (d) {
      return linkColor(d.diff);
    })
    .attr("class", "link")
    .attr("d", function (d) {
      try {
        return path(defaultPath);
      } catch (e) {
        return path(d);
      }
    })
    .style("opacity", 0)
    .style("stroke-width", function (d) {
      return Math.max(1, defaultPath.dy);
    })

    //BLANKING OUT BELOW KEEPS THE NODES FROM DISAPPEARING WHEN A PATH IS CLICKED;

    //   .on("click",function(d) {
    //       resetSizeDown();
    //       defaultPath = d;
    //       relayout(maindata,filter=function(e) {

    // added below back in.  was rmoved from major change saankey but in quigleys original code;

    // return e.child==d.parent.name || e.parent==d.parent.name || e.child=d.child.name || e.parent==d.child.name;

    //      });
    //  })

    //(PATH(LINK) TOOLTIP;

    .append("title")
    .text(function (d) {
      return (
        d.parent.name +
        " majors going into " +
        d.child.name +
        "\n" +
        format(d.value)
      );
    });

  link
    .transition()
    .duration(duration)
    .style("opacity", 0.9)
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  link.exit().remove();
  // add the link titles

  // add in the nodes
  var node = svg.selectAll(".node").data(graph.nodes, function (d) {
    return d.name;
  });

  entering = node.enter().append("g");

  entering
    .attr("transform", function (d) {
      try {
        d.relative =
          defaultPath.parent.x === d.x ? defaultPath.parent : defaultPath.child;
      } catch (error) {
        d.relative = d;
      }
      return "translate(" + d.x + "," + d.relative.y + ")";
    })
    .attr("class", "node");

  entering
    .append("title")
    .append("text")
    .text(function (d) {
      return d.name + "\n" + format(d.value);
    });

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
            console.log(traverse);
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
          if (d.name.substring(0, 1) == "3" || d.name.substring(0, 1) == "1") {
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
      return (d.color = divisionColors(d.name.substring(5, 2, d.name.length)));
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

  // I think the code below will add labels;

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
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

  node
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  // add the rectangles for the nodes
  node
    .selectAll("rect")
    .transition()
    .duration(duration)
    .style("opacity", 1)
    .attr("height", function (d) {
      return d3.max([2, this.parentNode.__data__.dy]);
    })
    .attr("width", sankey.nodeWidth());

  d3.selectAll("text.label")
    .transition()
    .duration(duration)
    .attr("y", function (d) {
      return this.parentNode.__data__.dy / 2;
    });

  node.exit().remove();
  // add in the title for the nodes

  //longer durations for all the later things.
  duration = 2000;
};

// load the data
d3.csv("Applicants1.csv", function (error, data) {
  var dat = data;
  // industries = d3.set(dat.map(function(d) {return d.parent.split("-")[0];})).values();
  // industryColors = d3.scale.category20().domain(industries);

  
  depts = d3
    .set(
      dat.map(function (d) {
        return d.parent.substring(4, 1, d.parent.length);
      })
    )
    .values();
  divisionColors = d3.scale.category20().domain(depts);
  //from http://www.d3noob.org/2013/02/formatting-data-for-sankey-diagrams-in.html
  relayout(
    data,
    (filter = function (d) {
      return true;
    })
  );
});

//functions

function reloadPage() {
  document.location.reload(true);
}

var dataToNodeList = function (data) {
  var graph = { nodes: [], links: [] };
  data.forEach(function (d) {
    // nodeNames.forEach(function(name) {
    //     //add a node for each relevant column
    //     graph.nodes.push({ "name": d[name] });
    // });
    graph.nodes.push({ label: d.parentDiv }); // Mark added this;
    graph.nodes.push({ label: d.childDiv }); // Mark added this;
    graph.nodes.push({ name: d.parent });
    graph.nodes.push({ name: d.child });
    graph.links.push({ parent: d.parent, child: d.child, value: d.count });
  });
  // return only the distinct / unique nodes
  graph.nodes = d3.keys(
    d3
      .nest()
      .key(function (d) {
        return d.name;
      })
      .map(graph.nodes)
  );

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (d, i) {
    graph.links[i].parent = graph.nodes.indexOf(graph.links[i].parent);
    graph.links[i].child = graph.nodes.indexOf(graph.links[i].child);
  });

  //now loop through each node to make nodes an array of objects
  // rather than an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { name: d };
  });
  return graph;
};
