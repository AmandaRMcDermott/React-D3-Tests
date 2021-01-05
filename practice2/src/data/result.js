import * as d3 from "d3";

//var csv is the CSV file with headers
function csvJSON(csv) {
  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
//const sankey_data = csvJSON("./sankey_data.csv");
const sankey_data = d3.csv("./sankey_data.csv").then((response) => {
  //console.log(response);
});

export default sankey_data;
