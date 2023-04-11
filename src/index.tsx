import React from "react";
import ReactDOM from "react-dom/client";

import Layout from "./components/Layout";
import Main from "./pages/Main";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Layout>
      <Main />
    </Layout>
  </React.StrictMode>
);
