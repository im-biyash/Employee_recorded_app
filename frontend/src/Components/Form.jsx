


import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

import { useNavigate } from "react-router-dom";
export default function Form() {
  const [name, setName] = useState("");
  const [employeeid, setEmployeeid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState("");
  const [post, setPost] = useState("");

  const [wage, setWage] = useState(0);
  const [error, setError] = useState("");

  const addEmployee = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !employeeid ||
      !email ||
      !phone ||
      !date ||
      !country ||
      !post ||
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
    formData.append("phone", phone);
    formData.append("date", date);
    formData.append("country", country);
    formData.append("post", post); // Corrected line
    formData.append("position", position);
    formData.append("wage", wage);

    try {
      await axios.post("http://localhost:3001/create", formData);

      // Clear all form fields
      console.log("Success");
      event.target.reset();
      setDate("");
    } catch (error) {
      // console.error("Error:", error.response.data.error);

      // Check if the error is due to an existing employee ID
      if (error.response.data.error === "Employee already exists") {
        alert("Employee with the provided ID already exists");
      } else {
        // Handle other types of errors
        setError(error.response.data.error);
      }
    }
  };

 
  return (
    <>
      <Navbar />
      <div className="bg-[#0a192f] min-h-screen">
        <div className="p-1 max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white ml-6">
            Employee Information
          </h1>
          <form
            className=" shadow-md rounded text-white px-8 pt-6 pb-8 mb-1  opacity-1 border-zinc-100 "
            onSubmit={addEmployee}
          >
            <div className="mb-2">
              <label htmlFor="name" className="block text-sm  mb-2 text-white ">
              Name:   
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
              <label
                htmlFor="email"
                className="block text-white text-sm font-bold mb-2"
              >
               Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="number"
                placeholder="Enter contact number"
                onChange={(e) => {
                  setPhone(e.target.value);
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
                Post
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="post"
                type="text"
                placeholder="Enter position"
                onChange={(e) => {
                  setPost(e.target.value);
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="position"
                className="block text-white text-sm mb-2"
              >
                Position
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="position"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                }}
              >
                <option value="">Select Position</option>
                <option value="intern">Intern</option>
                <option value="junior">Junior</option>
                <option value="mid-level">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
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