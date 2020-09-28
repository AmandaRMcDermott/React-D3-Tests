import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import "./App.css";

class App extends React.Component {
  componentDidMount() {
    d3.json("/data.json").then(console.log);
  }
  render() {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
