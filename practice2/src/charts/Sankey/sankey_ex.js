////////////////////////////////  TRANSITIONS HAVE BEEN DISABLED AROUND LINE 169 ;

var duration = 0;
var units = "Students";

var margin = { top: 10, right: 250, bottom: 10, left: 50 };

// CHANGE THE MARGIN VALUE (INCREASE AS NEGATIVE MOVES THE COLUMNS CLOSER TOGETHER - MAD;

// var width=(window.innerWidth-margin.left-margin.right) -50;
var width = 1250;

// ANY CHANGE HERE AFFECTS THE GRAPHIC HEIGHT, NOT THE CANVAS - MAD;
// THE DEFAULT WAS 800, CHANGE TO 400 DID NOT INCREASE THE CANVAS SIZE - MAD;

var height = 800;

var formatNumber = d3.format(",.0f"), // NO DECIMALS
  format = function (d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();

// APPEND THE SVG CANVAS TO THE PAGE;
// TRANSLATE: WHERE THE ELEMENT IS MOVED BY A RELATIVE VALUE IN THE X,Y DIRECTION;

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "svg-container")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg
  .append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", reloadPage);

$("#refresh").click(function () {
  document.getElementById("myField").value =
    document.getElementById("col").value + document.getElementById("yr").value;
  //alert("change===: " + "data\/data_"+ document.getElementById('myField').value+".csv");
  var dataVal = document.getElementById("myField").value;

  d3.csv("data/data_" + dataVal + ".csv", function (error, data) {
    var dat = data;

    depts = d3
      .set(
        dat.map(function (d) {
          return d.parent.substring(3, d.parent.length);
        })
      )
      .values();

    divisionColors = d3.scale.category20().domain(depts);
    //from http://www.d3noob.org/2013/02/formatting-data-for-sankey-diagrams-in.html
    relayout(
      dat,
      (filter = function (d) {
        return true;
      })
    );
  });
});

$("select").on("change", function () {
  //alert("select on change==" +  document.getElementById("col").value + document.getElementById("yr").value );
  document.getElementById("myField").value =
    document.getElementById("col").value + document.getElementById("yr").value;
  //alert("change===: " + "data\/data_"+ document.getElementById('myField').value+".csv");
  var dataVal = document.getElementById("myField").value;
  ///*if (dataVal=="AS14"){
  //		document.getElementById("errorMsg").innerHTML = "Fall 2014 Arts and Sciences data is not ready yet and will be coming soon!";
  //		dataVal="AS11";
  //	}
  //	else
  //		document.getElementById("errorMsg").innerHTML = "";*/

  d3.csv("data/data_" + dataVal + ".csv", function (error, data) {
    var dat = data;

    // industries = d3.set(dat.map(function(d) {return d.parent.split("-")[0];})).values();
    // industryColors = d3.scale.category20().domain(industries);

    /*    depts = d3.set(dat.map(function(d) {return d.parent.substring(4,1, d.parent.length);})).values();*/

    //Note on 11/4/16: The line above is the original and line below is modified. Both seem to work, (though the correct syntax should be the one below. Choose which ever works for you.

    depts = d3
      .set(
        dat.map(function (d) {
          return d.parent.substring(3, d.parent.length);
        })
      )
      .values();

    divisionColors = d3.scale.category20b().domain(depts);
    //from http://www.d3noob.org/2013/02/formatting-data-for-sankey-diagrams-in.html
    relayout(
      dat,
      (filter = function (d) {
        return true;
      })
    );
  });
});

var linkset = svg.append("g").attr("id", "linkSet");

// SET DIAGRAM PROPERTIES - MAD;

var state;

//  ARRAYS CREATED FOR DATA COLUMN NAMES - MAD;.

//var nodeLabels = ["childDiv", "parentDiv"];   // Mark added this line;
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

  //make the new data frame

  var sankey = d3.sankey().nodeWidth(42).nodePadding(8).size([width, height]);

  sankey.nodes(graph.nodes).links(graph.links).layout(12);

  // PATH PARAMETERS...COLOR, OPACITY, ETC.;
  // PATH COLOR SET TO VARY BASED ON RAGNE OF VALUES .1,1,10.  THE FACT THAT THE PATHS ARE ALL GREY MEANS THE
  // VALUES DO NOT VARY FROM 1.  NOT SURE YET HOW OR WHERE THESE VALUES ARE BEING SET;
  //  AT THIS POINT, PATHS ARE BEING CALLED BY THE OBJECT 'LINK';

  path = sankey.link();

  linkColor = d3.scale
    .log()
    .domain([0.1, 1, 10])
    .range(["red", "gold", "navy"]);

  //	    linkColor = d3.scale.log().domain([0.1,1,10]).range(["red","grey","blue"]);  ORIGINAL;

  //add in the links. changing 'height' below reduces the amount of spread, allowing the detail chart to fit
  // default height was 800, 750 clippped the bottom og the graph, things appear to fit at 700

  //  MAKE VAR LINK;

  var link = linkset.selectAll(".link").data(graph.links, function (d) {
    return d.parent.name + "-" + d.child.name;
  });

  var resetSizeDown = function (filename) {
    height = 800;
    d3.select("svg")
      .transition()
      .duration(duration)
      .attr("height", window.innerHeight);
    svg.attr("height", 800);
    sankey.size([width, height]);
  };

  // PATH(link) AND TOOLTIP FORMATTING - MAD;

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
    }) // dy IS A RELATIVE COORDINATE -- RELATIVE TO y;

    /*.on("click",function(d) {
           resetSizeDown();                                                       //  BLANKING THIS OUT PREVENTS NODES FROM VANISING WHEN PATHS ARE CLICKED;
           defaultPath = d;
           relayout(maindata,filter=function(e) {
   
               });
         })*/

    // PATH(link) TOOLTIP;

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
    .style("opacity", 0.65) // LIGHTENS THE PATHS OPACITY.  1.0 IS TOO DARK ON MOUSEOVER, .3 IS TOO LIGHT, USING .65;
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  link.exit().remove(); // BLANK THIS OUT AND NODES VANISH ON CLICK BUT PATHS STAY;

  // ADD NODES

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
      // resetSizeDown(d.name);

      defaultPath = link
        .filter(function (e) {
          return e.parent.name == d.name || e.child.name == d.name; //ON CLICK TRANSITION IS DISABLED IF REMOVED
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
              remainingNodes.push(link[step.nodeType]); // BLANK THIS OUT AND YOU GET THE CLICKED NODE AND ITS CHILD ONLY;
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
          ); // BLANK THIS OUT AND YOU GET THE CLICKED NODE AND ITS CHILD ONLY, SAME AS ABOVE;

          //alert(nodeNames);

          // NODE IN F1 COLUMN IS CLICKED;

          if (d.name.substring(0, 3) == "F1-") {
            return (
              e.parent == d.name /*|| e.child==d.name */ ||
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

          // NODE IN F2 COLUMN IS CLICKED;
          // F1 VANISHES, F2 TO F6 ARE OK;

          if (d.name.substring(0, 3) == "F2-") {
            return (
              e.parent == d.name ||
              e.child == d.name ||
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

          // NODE IN F3 COLUMN IS CLICKED;
          // F3 MOVES TO BOTTOM LEFT UNDER F1, F2 MOVES TO FAR RIGHT, F4 TAKES PLACE OF F2, F5 TAKES PLACE OF F3, F6 STAYS RIGHT UNDER F2;

          if (d.name.substring(0, 3) == "F3-") {
            return (
              e.parent == d.name ||
              e.child == d.name ||
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

          // NODE IN F4 COLUMN IS CLICKED;
          // F4 MOVES TO BOTTOM LEFT UNDER F1, F2 TO F3 MOVE TO THE RIGHT, F5 IS UNDER F2, F6 STAYS RIGHT UNDER F3;

          if (d.name.substring(0, 3) == "F4-") {
            return (
              e.parent == d.name ||
              e.child == d.name ||
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

          // NODE IN F5 COLUMN IS CLICKED;
          // F5 MOVES TO BOTTOM LEFT UNDER F1, F2 TO F4 MOVE TO THE RIGHT, F6 STAYS RIGHT UNDER F4;

          if (d.name.substring(0, 3) == "F5-") {
            return (
              e.parent == d.name ||
              e.child == d.name ||
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

          // NODE IN F6 COLUMN IS CLICKED;

          // F6 VANISHES;

          if (d.name.substring(0, 3) == "F6-") {
            return (
              e.parent == d.name ||
              e.child == d.name ||
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
        })
      );
    })

    /////////////////////////////////////////////////////////////////////////////////////////////////////////;

    .style("fill", function (d) {
      // return d.color = divisionColors(d.name.substring(12,2, d.name.length));})
      return (d.color = divisionColors(d.name.substring(12, d.name.length)));
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

  // NOTE about .em35 -- This scalable unit allows the text to be set as a factor of the size of the text;
  // In this case .35em will add half the height of the text to the y dimension placing the text so that;
  // it is exactly in the middle (vertically) of the 100 pixel line on the y dimension;

  entering
    .append("text")
    .attr("class", "label")
    .attr("x", 48) // Reset last 3 column labels to the right by 48 pixels corrects label alignment issue;
    .attr("dy", ".35em")
    .attr("text-anchor", "start") //  Controls F3 to F6 labels;  labels now moved toward the right but not to the right margine of the node;
    .attr("font-size", "8px")
    .attr("transform", null)
    .text(function (d) {
      return (
        d.name.substring(0, 3) +
        d.name.substring(8, d.name.length) +
        " " +
        d.value
      );
    })
    // .text(function(d) { return d.name.substring(0,3)+  d.name.substring(8,d.name.length) + " " + d.value;})
    // .text(function(d) { return d.name + " " + d.value;})
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start"); // Controls F1 to F3 labels ; start and before-edge have the same effect;

  //  removing this section pushes all labels up to the top;

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

  //  puts lables in the middle of the rec;

  d3.selectAll("text.label")
    .transition()
    .duration(duration)
    .attr("y", function (d) {
      return this.parentNode.__data__.dy / 2;
    });

  node.exit().remove();

  //   SETS THE DURATION OF THE EVENTS IN MILISECONDS;

  duration = 2000;
};

// LOAD THE DATA
// SCALE: WHERE THE ELEMENT'S ATTRIBUTES ARE INCREASED OR REDUCED BY A SPECIFIED FACTOR;

// alert("testing-change-click: " + document.getElementById("col").value + document.getElementById("yr").value);
//alert("before===: " + document.getElementById('myField').value);

d3.csv(
  "data/data_" + document.getElementById("myField").value + ".csv",
  function (error, data) {
    var dat = data;

    // industries = d3.set(dat.map(function(d) {return d.parent.split("-")[0];})).values();
    // industryColors = d3.scale.category20().domain(industries);

    /*    depts = d3.set(dat.map(function(d) {return d.parent.substring(4,1, d.parent.length);})).values();*/

    //Note on 11/4/16: The line above is the original and line below is modified. Both seem to work, (though the correct syntax should be the one below. Choose which ever works for you.

    depts = d3
      .set(
        dat.map(function (d) {
          return d.parent.substring(3, d.parent.length);
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
  }
);

//functions

function reloadPage() {
  document.location.reload(true);
}

// SET UP GRAPH - MAD;
// CREATE INDEX - MAD;

var dataToNodeList = function (data) {
  var graph = { nodes: [], links: [] };
  data.forEach(function (d) {
    // nodeNames.forEach(function(name) {
    //     //add a node for each relevant column
    //     graph.nodes.push({ "name": d[name] });
    // });
    //   graph.nodes.push({ "label": d.parentDiv });   // Mark added this;
    //   graph.nodes.push({ "label": d.childDiv });    // Mark added this;
    graph.nodes.push({ name: d.parent });
    graph.nodes.push({ name: d.child });
    graph.links.push({ parent: d.parent, child: d.child, value: d.count });
  });

  // RETURN DISTINCT NODES ONLY - MAD;

  graph.nodes = d3.keys(
    d3
      .nest()
      .key(function (d) {
        return d.name;
      })
      .map(graph.nodes)
  );

  // LOOP THROUGH EACH LINK REPLACING THE TEXT WITH ITS INDEX FROM THE NODE - MAD;

  graph.links.forEach(function (d, i) {
    graph.links[i].parent = graph.nodes.indexOf(graph.links[i].parent);
    graph.links[i].child = graph.nodes.indexOf(graph.links[i].child);
  });

  // LOOP THROUGH EACH LINK ENTRY AND EACH PARENT AND CHILD, FINDS THE UNIQUE INDEX NUMBER
  // OF THAT NAME IN THE NODES ARRAY AND ASSIGNS THE LINK SOURCE AND TARGET TO THE
  // APPROPRIATE NUMBER - ANNOTATION PROVIDED BY MAL MCLEAND3NOOB.ORG;

  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { name: d };
  });
  return graph;
};
