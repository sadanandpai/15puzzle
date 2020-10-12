import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <div>
    <h1>15 PUZZLE</h1>
    <div className="instruction">Click on the box to move it and sort row-wise</div>
    <App />
  </div>,
  document.getElementById("root")
);
