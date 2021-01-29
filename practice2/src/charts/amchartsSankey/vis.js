import * as d3 from "d3";
//import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import _, { round } from "lodash";
//import { quantileSorted, threshold } from "d3-array";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const transformData = (props) => {
  let data = [];
  if (props.data !== null) {
    data = _.cloneDeep(props.data);
  }

  let chart = am4core.create("vis-sankeyam", am4charts.XYChart);
    
  am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create("vis-sankeyam", am4charts.SankeyDiagram);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      
      /*
      chart.data = [
        { from: "eFile", to: "Refund", value: 10 },
        { from: "Refund", to: "Full Pay", value: 8 },
        { from: "eFile", to: "Balance Due", value: 4 },
        { from: "Balance Due", to: "Full Pay", value: 3 },
        { from: "eFile", to: "Refund", value: 5 },
        { from: "Refund", to: "Full Pay", value: 2 },   
      ];
      */

      let hoverState = chart.links.template.states.create("hover");
      hoverState.properties.fillOpacity = 0.6;
      
      chart.dataFields.fromName = "source";
      chart.dataFields.toName = "target";
      chart.dataFields.value = "value";
      
      // for right-most label to fit
      chart.paddingRight = 100;
      
      // make nodes draggable
      var nodeTemplate = chart.nodes.template;
      nodeTemplate.inert = true;
      nodeTemplate.readerTitle = "Drag me!";
      nodeTemplate.showSystemTooltip = true;
      nodeTemplate.width = 20;
      
      // make nodes draggable
      var nodeTemplate = chart.nodes.template;
      nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
      nodeTemplate.showSystemTooltip = true;
      nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
      
      }); // end am4core.ready()
  //this.chart = chart;

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

    return  graph; 

  }

const graph=formatData(data)
console.log(graph)
}

export default transformData;