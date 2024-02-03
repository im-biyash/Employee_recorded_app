
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Form from "./Components/Form";
import Employee from "./Components/Employee";
import Employeeedit from "./Components/Employeeedit";
import EmployeeLogin from "./Components/EmployeeLogin";
import SpecificEmployeepage from "./Components/SpecificEmployeepage";


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
          <Route path="/employeeLogin" element={<EmployeeLogin/>} />
          <Route path="/specificEmployeepage/:id" element={<SpecificEmployeepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;