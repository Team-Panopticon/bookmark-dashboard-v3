import React from "react";
import ReactDOM from "react-dom/client";
import Desktop from "../pages/Desktop";
import { layoutDB } from "./utils/layoutDB";
import "./index.css";

(async () => {
  await layoutDB.initDB();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Desktop />
    </React.StrictMode>
  );
})();
