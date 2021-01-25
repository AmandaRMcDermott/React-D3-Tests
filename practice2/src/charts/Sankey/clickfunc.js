.on("click", function (d) {
    //resetSizeDown();
    console.log(link._enter);
    console.log(link);
    /*link
      .selectAll(".link")
      .filter(function (e) {
        return e.source.name == d.name || e.target.name == d.name;
        //console.log(e.source.name == d.name || e.target.name == d.name);
      })
      .data(graph.links)
      .enter()
      .append("path");*/
    //defaultPath

    //console.log(defaultPath);
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
            remainingNodes.push(link[step.nodeType]); // Blanking this out gives the clicked node and child only

            allLinks.push(link[step.nodeType].name); // this screws up a lot of stuff
            //console.log(link);
            //console.log(remainingNodes);
            console.log(d[step.linkType]);
            //console.log(link[step.nodeType]);
            //console.log(remainingNodes);
          });

          //console.log(d);

          while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
              node[step.linkType].forEach(function (link) {
                nextNodes.push(link[step.nodeType]);65566
                allLinks.push(link[step.nodeType].name);

                console.log(link[step.nodeType].name);
                console.log(remainingNodes);
              });
            });
            remainingNodes = nextNodes;
            console.log(nextNodes);
          }
        });

        //console.log(nextNodes);
        //console.log(d);
        var nodeNames = d3.keys(
          d3
            .nest()
            .key(function (d) {
              return d;
            })
            .object(allLinks)
        );
        //console.log(allLinks);
        /*
        var nodeNames = d3.keys(
          d3.nest().key(function (d) {
            return d.name;
            console.log(d);
          })
          .map(allLinks)
      
        
        );
        */
        //console.log(d);
        //console.log(nodeNames[nodeNames.indexOf(e.target)]);
        // when changing from 'i' to 'F1-' must address substring as well

        // NODE IN FIRST COLUMN IS CLICKED;

        if (d.name.substring(0, 1) == "1") {
          //console.log(d.name);
          console.log(nodeNames[nodeNames.indexOf(e.target)]);
          //console.log(nodeNames.indexOf(e.source));
          return (
            e.source == d.name /*|| e.target==d.name */ ||
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
          /*console.log(
            "Target",
            nodeNames.indexOf(e.target) > -1
              ? nodeNames[nodeNames.indexOf(e.target)]
              : ""
          );
          console.log(
            "Source",
            nodeNames.indexOf(e.source) > -1
              ? nodeNames[nodeNames.indexOf(e.source)]
              : ""
          );
*/
          return (
            e.source == d.name ||
            e.target == d.name ||
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
        if (d.name.substring(0, 1) == "3") {
          //console.log(d.name);
          return (
            e.source == d.name ||
            e.target == d.name ||
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
        if (d.name.substring(0, 1) == "4") {
          return (
            e.source == d.name ||
            e.target == d.name ||
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
        // degree is clicked
        //console.log(allLinks);
        /*
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
          console.log(e.target);
        }*/
      })
    );
  })
  