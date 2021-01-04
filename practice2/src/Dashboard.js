import React, { Component } from "react";
import nycdata from "./data/nyc_weather_data.json";
import data from "./data";
//import nyc_data3 from "../public/data";
import View1 from "./views/View1";
import View3 from "./views/View3";
import { Layout } from "antd";
//import * as d3 from "d3";

const { Sider, Content } = Layout;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linedata: data[0],
      nyc: nycdata,
    };
  }

  render() {
    const { linedata, nyc } = this.state;
    //console.log(nyc);
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
