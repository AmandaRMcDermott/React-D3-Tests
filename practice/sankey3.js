const drawSankeyChart = async () => {
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15, // small top
      right: 15, // small right to give the chart space
      bottom: 40, // larger bottom for axes
      left: 60, // larger left for axes
    },
  };

  const svg = d3
    .select("body")
    .append("svg")
    .attr(
      "width",
      dimensions.width + dimensions.margin.left + dimensions.margin.right
    )
    .attr(
      "height",
      dimensions.height + dimensions.margin.top + dimensions.margin.bottom
    )
    .append("g")
    .attr(
      "transform",
      "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    );

  // Set the sankey diagram properties
  const sankey = d3
    .sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([dimensions.width, dimensions.height]);

  //cont path = sankey.link()

  d3.csv("./sankey_data.csv").then(function (dataset2) {
    // set up empty graph
    const graph = { nodes: [], links: [] };

    // set up data source and target nodes
    dataset2.forEach(function (d) {
      graph.nodes.push({ name: d.source });
      graph.nodes.push({ name: d.target });
      graph.links.push({
        source: d.source,
        target: d.target,
        value: +d.value,
      });
    });

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
      graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
      graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    // loop through each node to make nodes an array of objecets
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
      graph.nodes[i] = { name: d };
    });

    sankey.nodes(graph.nodes).links(graph.links).layout(32);

    // add in the links
    const links = svg.append("g").selectAll(".link");
    console.log(sankey);
  });
  //console.table(sankey);
  //console.table(dataset2);
};

drawSankeyChart();
