import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import logout from "../Assets/logout.png";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [name, setName] = useState("");
  const [employeeid, setEmployeeid] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState("");

  const [wage, setWage] = useState(0);
  const [error, setError] = useState("");

  const addEmployee = async (event) => {
    event.preventDefault();
  
    if (
      !name ||
      !employeeid ||
      !email ||
      !date ||
      !country ||
      !position ||
      !wage ||
      !photo
    ) {
      alert("All fields are required");
      return;
    }
  
    const formData = new FormData();
    formData.append("photo", photo);
  
    // Append other form data
    formData.append("name", name);
    formData.append("employeeid", employeeid);
    formData.append("email", email);
    formData.append("date", date);
    formData.append("country", country);
    formData.append("position", position);
    formData.append("wage", wage);
  
    try {
      await axios.post("http://localhost:3001/create", formData);
  
      // Clear all form fields
   
  
      console.log("Success");
      event.target.reset();

  
    } catch (error) {
      console.error("Error:", error.response.data.error);
      setError(error.response.data.error);
      return;
    }
  };
  
  const navigate = useNavigate();
  const logoutHandler = () => {
    navigate("/");
  };
  return (
    <>
      <Navbar />
      <div className="bg-[#0a192f] min-h-screen">
        <div className="p-1 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 ml-6">
            Employee Information
          </h1>
          <form
            className=" shadow-md rounded text-white px-8 pt-6 pb-8 mb-1  opacity-1 border-zinc-100 "
            onSubmit={addEmployee}
          >
            <div className="mb-2">
              <label htmlFor="name" className="block text-sm  mb-2 text-white ">
                Name
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Enter name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="employeeId"
                className="block text-white  text-sm  mb-2"
              >
                Employee ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="employeeId"
                type="text"
                placeholder="Enter employee ID"
                onChange={(e) => {
                  setEmployeeid(e.target.value);
                }}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-white text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block text-white text-sm  mb-2">
                Hire Date
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="date"
                placeholder="Enter email"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(setDate);
                }}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="country"
                className="block text-white text-sm  mb-2"
              >
                Country
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="country"
                type="text"
                placeholder="Enter country"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="position"
                className="block text-white text-sm  mb-2"
              >
                Position
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="position"
                type="text"
                placeholder="Enter position"
                onChange={(e) => {
                  setPosition(e.target.value);
                }}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="wage" className="block text-whitetext-sm  mb-2">
                Wage
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="wage"
                type="text"
                placeholder="Enter wage"
                onChange={(e) => {
                  setWage(e.target.value);
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="Iprofile"
                className="block text-whitetext-sm  mb-2"
              >
                Profile
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                }}
              />
            </div>
            <div>{error && <p className="text-red-800"> {error}</p>}</div>

            <div className="mb-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded focus:outline-none focus:shadow-outline"
              >
                Save employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}