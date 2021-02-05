import React, { Component } from "react";
//import transformData from "./vis";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default class SankeyPlotAm extends Component {
  componentDidMount() {

    //const data = transformData(this.props)

var data = this.props.data
console.log(data)

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
        
        // Read in data 
        chart.data = data;
        chart.dataFields.fromName = "from";
        chart.dataFields.toName = "to";
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
        
        // navigation
        var nav = chart.createChild(am4charts.NavigationBar);
        nav.data = [{ name: "Home" }];
        nav.toBack();

        // Drilldown feature
        chart.links.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        chart.links.template.events.on("hit",function(ev){
            chart.colors.reset();
            let linkData = ev.target.dataItem.dataContext;

            // for navigation
            let nav = chart.children.getIndex(0);

            if (linkData.sub) {
                chart.data = linkData.sub;

                nav.data.push({
                    name: ev.target.populateString("{fromName}->{toName}"),
                    step: ev.target.dataItem.dataContext
                });
                nav.invalidateData();
            }

            // navigation functionality
            nav.links.template.events.on("hit", function(ev) {
                var target = ev.target.dataItem.dataContext;
                var nav = ev.target.parent;
                
                chart.colors.reset();
                if(target.step) {
                    chart.data = target.step.sub;
                    nav.data.splice(nav.data.indexOf(target) + 1);
                    nav.invalidateData();
                } else {
                    chart.data = data;
                    nav.data = [{name: "Home" }]
                }
            })
            console.log(nav)

        })

        chart.sequencedInterpolation = false
        chart.sequencedInterpolationDelay = 1000
        }); // end am4core.ready()
    this.chart = chart;
    //drawsankey(this.props);
  }

  //componentDidUpdate(preProps) {

    //transformData(this.props);
  //}

  componentWillUnmount(){
      if (this.chart) {
        this.chart.dispose();
      }
  }
  render() {
    return <div className="vis-sankeyam" />;
  }
}
