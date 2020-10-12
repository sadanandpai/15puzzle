import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <div>
    <h1>
      <a href="https://github.com/sadanandpai/15puzzle" target="_blank">
        15 PUZZLE
      </a>
    </h1>
    <div className="instruction">Click on the box to move it and sort row-wise</div>
    <App />
  </div>,
  document.getElementById("root")
);
