import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <div id="warningdiv">
        <h1 id="warning">
          Purchase of lottery using this website is strictly prohabited in the state where lotteries are banned.
          You must be above 18 Years to play online lottery
        </h1>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
