import React, { Component, useEffect } from "react";
import Papa from "papaparse";

export default function () {
  const [rows, setRows] = React.useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch("../../data/nyc_data3.csv");
      const reader = response.body.getReader();
      const result = await reader.read; // raw array
    }
    getData();
  }, []);
  return console.log(result);
}
