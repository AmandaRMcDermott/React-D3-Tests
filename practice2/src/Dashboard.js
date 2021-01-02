import React, { Component } from "react";
//import data1 from "./data/nyc_weather_data.json";
import data from "./data/index";
//import data from "./data";
import View3 from "./views/View3";
import { Layout } from "antd";
const { Sider, Content } = Layout;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = data[0];
  }
  render() {
    const linedata1 = this.state;
    console.log(linedata1);
    return (
      <div>
        <Layout style={{ height: 920 }}>
          <Layout>
            <Content style={{ height: 800 }}>
              <View3 user={linedata1} />
            </Content>
            <Sider width={300} style={{ backgroundColor: "black" }}></Sider>
          </Layout>
        </Layout>
      </div>
    );
  }
}
