import React, { useState } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import _ from "lodash";
import { useTransition, animated } from "react-spring";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15, // small top
      right: 15, // small right to give the chart space
      bottom: 100, // larger bottom for axes
      left: 40, // larger left for axes
    },
  };

// size of the bounds
dimensions.boundedWidth =
dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
dimensions.height - dimensions.margin.top - dimensions.margin.bottom;


const sankeyLayout = sankey()
.nodeWidth(36)
.nodePadding(40)
.size([dimensions.width, dimensions.height]);

const linkLayout = sankeyLinkHorizontal();

const drawsankey = ( props ) => {

    let data = [];
    if (props.data !== null) {
        data = _.cloneDeep(props.data);
    }
    
  const { nodes, links } = sankeyLayout(data)
  
  console.log(sankeyLayout)

  
  const getLinkTransition = (link) => {
    const d = linkLayout({
      source: link.source,
      target: link.target,
      y0: link.y0,
      y1: link.y1
    });
    return {
      strokeWidth: link.width,
      d
    };
  };
  const getLinkId = (link) => [link.source.name, link.target.name].join("-");
/*  const linkTransitions = useTransition(links, (link) => getLinkId(link), {
    from: (link) => ({
      ...getLinkTransition(link),
      strokeOpacity: 0
    }),
    update: (link) => ({
      ...getLinkTransition(link)
    }),
    enter: (link) => ({
      ...getLinkTransition(link),
      strokeOpacity: 0.5
    }),
    leave: (link) => ({
      ...getLinkTransition(link),
      strokeOpacity: 0
    })
  });
  */
};


export default drawsankey;
