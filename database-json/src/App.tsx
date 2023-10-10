import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "styled-components";
import RunQuery from "./Components/Pages/RunQuery";
import SeeTables from "./Components/Pages/SeeTables";
import { SqlProvider } from "./context/SqlContext";
import SideBar from "./Components/Organisms/SideBar";

function App() {
  return (
    <Router>
      <div className="App">
        <SqlProvider>
          <SideBar />
          <Routes>
            <Route path="/run-query" element={<RunQuery />} />
            <Route path="/see-table" element={<SeeTables />} />
          </Routes>
        </SqlProvider>
      </div>
    </Router>
  );
}

export default App;
