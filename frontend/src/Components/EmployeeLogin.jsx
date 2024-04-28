import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleEmployeeLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/employeeLogin/", {
        employeeName: employeeName,
        employeeId: employeeId,
      });
      if (res.data === "success") {
        navigate(`/SpecificEmployeepage/${employeeId}`);
      } else {
        alert("you are not employee");
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border-2 rounded p-8">
        <h1 className="mb-4 text-center text-3xl">
          Login to see your information
        </h1>
        <div className="flex flex-col mb-4">
          <label className="mb-2">Your Name:</label>
          <input
            type="text"
            className="p-2 rounded-2xl border border-gray-400"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2">Your Employee ID:</label>
          <input
            type="text"
            className="p-2 rounded-2xl border border-gray-400"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-pink-500 rounded-lg p-2 mt-5 text-white font-bold hover:bg-slate-100"
          onClick={handleEmployeeLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
