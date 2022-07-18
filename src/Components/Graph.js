import React from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";

const FundSmith = [6.32, 6.0, 5.85, 5.32, 4.9, 6.7, 6.9];
const vang = [258.4, 240.2, 230.4, 267.9, 256.3, 248.3];

const ripp = [62.72, 46.7, 59.11, 62.9, 46.6, 31.3, 24.65];
const bit = [2870415, 3251497, 3452406, 2881053, 2466105, 1567420, 1739098];
const eth = [
  280734.66,
  209052.07,
  225390.02,
  261888.01,
  216167.75,
  140897.06,
  83496.1
];

export default function Graph() {
  const [data, setState] = useState({});

  const handleClick = (event) => {
    console.log(event.target.value);
    let value = event.target.value;
    let inputArray = [];
    let color = "#FF0000";
    if (value === "Bitcoin") {
      inputArray = bit;
      color = "#FFFF00";
    } else if (value === "Ethereum") {
      inputArray = eth;
      color = "#00FF00";
    } else if (value === "Fund-Smith") {
      inputArray = FundSmith;
      color = "#ADD8E6";
    } else if (value === "Ripple") {
      inputArray = ripp;
      color = "#ADD8E6";
    } else if (value === "Vanguard") {
      inputArray = vang;
      color = "#A020F0";
    }

    const label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    let dataset = [];
    let val = {};
    val["label"] = event.target.value;
    val["data"] = inputArray;
    val["fill"] = false;
    val["borderColor"] = color;
    dataset.push(val);

    setState({ labels: label, datasets: dataset });
  };
  return (
    <div className="App">
      <div>
        <Line data={data} />
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around"
        }}
      >
        <div>
          <input
            type="radio"
            id="bitcoin"
            name="graph"
            value="Bitcoin"
            onClick={handleClick}
          ></input>
          <label htmlFor="bitcoin">Bitcoin</label>
        </div>
        <div>
          <input
            id="ethereum"
            type="radio"
            name="graph"
            value="Ethereum"
            onClick={handleClick}
          ></input>
          <label htmlFor="ethereum">Ethereum</label>
        </div>
        <div>
          <input
            type="radio"
            id="ripple"
            name="graph"
            value="Ripple"
            onClick={handleClick}
          ></input>
          <label htmlFor="ripple">Ripple</label>
        </div>
        <div>
          <input
            id="smith"
            type="radio"
            name="graph"
            value="Fund-Smith"
            onClick={handleClick}
          ></input>
          <label htmlFor="smith">Fund-Smith</label>
        </div>
        <div>
          <input
            id="vanguard"
            type="radio"
            name="graph"
            value="Vanguard"
            onClick={handleClick}
          ></input>
          <label htmlFor="vanguard">Vanguard</label>
        </div>
      </div>
      <div>{/* <Line data={data} /> */}</div>
    </div>
  );
}
