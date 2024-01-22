
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Form from "./Components/Form";
import Employee from "./Components/Employee";
import Employeeedit from "./Components/Employeeedit";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={< Login/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/edit/:id" element={<Employeeedit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;