const drawSankeyChart = async () => {
  const dataset2 = await d3.csv("./sankey_data.csv");
  //console.table(dataset2[0]);

  const graph = { nodes: [], links: [] };

  // set up data source and target nodes
  dataset2.forEach((startingpoint) => {
    graph.nodes.push({ name: dataset2.source });
    graph.nodes.push({ name: dataset2.target });
    graph.links.push({
      source: dataset2.source,
      target: dataset2.target,
      value: +dataset2.value,
    });
  });
  /*
  graph.nodes = d3.keys(
    d3
      .nest()
      .key(function (dataset2) {
        return dataset2.name;
      })
      .object(graph.nodes)
  );

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (dataset2, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });
*/
  console.log(graph);
  console.log(dataset2);
};

drawSankeyChart();
