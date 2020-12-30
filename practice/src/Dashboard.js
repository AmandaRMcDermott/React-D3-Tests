import React, { Component } from "react";
import data from "./data";
import View1 from "./views/View1";
import { Layout } from "antd";
const { Sider, Content, Footer } = Layout;

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <Layout style={{ height: 920 }}></Layout>
        <Sider width={300}>
          <Content style={{ height: 200 }}>
            <View1 />
          </Content>
        </Sider>
      </div>
    );
  }
}
