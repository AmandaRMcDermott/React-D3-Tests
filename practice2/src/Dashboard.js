import React, { Component, useEffect, useState } from "react";
import nycdata from "./data/nyc_data2";
import data1 from "./data/index";
//import data from "./data";
//import nyc_data3 from "../public/data";
import View1 from "./views/View1";
import View3 from "./views/View3";
import { Layout } from "antd";
import * as d3 from "d3";
const { Sider, Content } = Layout;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linedata: data1[0],
      nyc: nycdata,
    };
  }

  render() {
    const testdata = require("./data/nyc_weather_data.json");
    //const ha = fetch("../public/data/nyc_data3.csv");
    //console.log(nyc_data3);
    const { linedata, nyc } = this.state;
    return (
      <div>
        <Layout style={{ height: 920 }}>
          <Layout>
            <Content style={{ height: 300 }}>
              <View3 user={linedata} />
            </Content>
            <Layout style={{ height: 300 }}>
              <Content>
                <View1 />
              </Content>
            </Layout>
            <Sider width={300} style={{ backgroundColor: "black" }}></Sider>
          </Layout>
        </Layout>
      </div>
    );
  }
}

/*
    const [data, setData] = useState([]);
    useEffect(() => {
      d3.csv("./data/nyc_data3.csv").then((data) => {
        setData(data);
      });
    }, []);
*/
