import React, { Component } from "react";
import View1 from "./views/View1";
import View2 from "./views/View2";
import View3 from "./views/View3";
import View4 from "./views/View4";
import data2 from "./data";
import nycdata from "./data/nyc_weather_data.json";

import { Layout } from "antd";

/*
If the app doesn't run on Windows, do the following:
1) Delete nodes_modules
2) Delete package-lock.json
3) Add the following chunk to package.json:
'
"optionalDependencies": {
    "fsevents": "^2.0.7"
}
'
4) Run npm i
5) Run npm start
*/

const { Sider, Content } = Layout;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    //console.log(data);
    //console.log(data2[0].sankey_data[0]);
    this.state = {
      linedata: data2[0].data[0][0],
      nyc: nycdata,
      sankey: data2[0].sankey_data[0],
    };
  }

  render() {
    const { linedata, nyc, sankey } = this.state;
    //console.log(this.state);
    return (
      <div>
        <Layout style={{ height: 2000 }}>
          <Layout>
            <Content style={{ height: 650 }}>
              <View2 data={sankey} />
            </Content>
            <Content style={{ height: 650 }}>
              <View4 data={sankey} />
            </Content>
            <Content style={{ height: 450 }}>
              <View1 data={nyc} />
            </Content>
            <Content style={{ height: 450 }}>
              <View3 user={linedata} />
            </Content>
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
