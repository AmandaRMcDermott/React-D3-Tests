const drawSankeyChart = async () => {
  const dataset2 = await d3.csv("./sankey_data.csv");
  //console.table(dataset2[0]);

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

  const graph = { nodes: [], links: [] };

  // Set the sankey diagram properties
  const sankey = d3
    .sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([dimensions.width, dimensions.height]);

  // set up data source and target nodes
  dataset2.forEach((startingpoint) => {
    graph.nodes.push({ name: dataset2.source });
    graph.nodes.push({ name: dataset2.target });
    graph.links.push({
      source: dataset2.source,
      target: dataset2.target,
      value: +dataset2.value,
    });
    console.log(dataset2);
    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
      graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
      graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });
  });

  //console.log(graph.links);
};

drawSankeyChart();
