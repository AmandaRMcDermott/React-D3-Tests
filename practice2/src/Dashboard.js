import React, { Component } from "react";
import View1 from "./views/View1";
import View3 from "./views/View3";
import data from "./data";
import nycdata from "./data/nyc_weather_data.json";
//import sankey_data from "./data/sankey_data.csv";
import sankey_data from "./data";
import { Layout } from "antd";
//import Papa from "papaparse";
//import {useTooltip, tooltipContext} from "./useTooltips";
import * as d3 from "d3";

const { Sider, Content } = Layout;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    //const test = d3.csv(sankey_data).then((response) => {
    //  console.log(response);
    //});
    //console.log(test);

    this.state = {
      linedata: data[0],
      nyc: nycdata,
      sankey: sankey_data,
    };
  }

  render() {
    const { linedata, nyc, sankey } = this.state;
    console.log(sankey);
    return (
      <div>
        <Layout style={{ height: 1000 }}>
          <Layout>
            <Content style={{ height: 400 }}>
              <View3 user={linedata} />
            </Content>
            <Layout style={{ height: 400 }}>
              <Content>
                <View1 data={nyc} />
              </Content>
            </Layout>
            <Sider width={100} style={{ backgroundColor: "black" }}></Sider>
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
