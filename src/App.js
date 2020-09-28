import React, {useRef, useEffect, useState } from "react";
import "./App.css";
import { select } from "d3";

//export default function App() {
 // return (
  //  <div className="App">
   //   <h1>Hello CodeSandbox</h1>
    //  <h2>Start editing to see some magic happen!</h2>
    //</div>
  //);
//}

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 76]);
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    // select all the circles and sync them with the data
    svg.selectAll("circle").data(data)
      .join(
        enter => enter.append("circle").attr("class", "new"),
        // pass circle values to update for when button is pressed
        update => update
            .attr("class", "updated")
            //add circle radius
            .attr("r", value => value)
            // x coord of the circle
            .attr("cx", value => value * 2)
            // y coord
            .attr("cy", value => value * 2),
        exit => exit.remove()
      );
  }, [data]);
  return( 
    <React.Fragment>
      <svg ref={svgRef}></svg>
      <br />
      <button onClick={() => setData(data.map(value => value + 5))}>
        Update Data
      </button>
      <button onClick={() => setData(data.filter(value => value < 35))}>
        Filter Data
      </button>
    </React.Fragment>
  );
}

export default App;