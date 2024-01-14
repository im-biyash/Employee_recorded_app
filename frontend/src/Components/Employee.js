import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Employees() {
  const [employeeList, setEmployeeList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortingOption, setSortingOption] = useState("name"); // Set default sorting to "name"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");

useEffect(() =>{
  const fetchdata = async ()=>{
    try{
      const result = await axios.get("http://localhost:3001/employees");
      setEmployeeList(result.data);
    }
    catch(error){
      
    console.log("error in getting daa from backend", error);

    }
  };
  fetchdata();
}, [])


  const sortEmployeeList = () => {
    if (sortingOption === "name") {
      setEmployeeList(
        [...employeeList].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else if (sortingOption === "wages") {
      setEmployeeList(
        [...employeeList].sort(
          (a, b) => parseFloat(a.wage) - parseFloat(b.wage)
        )
      );
    } else if (sortingOption === "date") {
      setEmployeeList(
        [...employeeList].sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    }
  };

  const updateFilteredList = () => {
    return employeeList.filter((employee) => {
      const nameMatches = employee.name.toLowerCase().includes(searchInput.toLowerCase());
      const positionMatches = selectedPosition ? employee.position.toLowerCase() === selectedPosition.toLowerCase() : true;
      return nameMatches && positionMatches;
    });
  };
  

  const deleteEmployee = (employeeid) => {
    axios
      .delete(`http://localhost:3001/delete/${employeeid}`)
      .then((response) => {
        if (response.data.error) {
          console.error("Error deleting employee: " + response.data.error);
        } else {
          var newList = employeeList.filter(
            (employee) => employee.employeeid !== employeeid
          );
          setEmployeeList(newList);
        }
      })
      .catch((error) => {
        console.error("Error deleting employee: " + error.message);
      });
  };

  const viewEmployee = (employee) => {
    setSelectedEmployee(employee);
    console.log(employee);
    setIsModalOpen(true);
  };

  const printEmployeeList = () => {
    window.print();
  };
  const printIndividualRecord = () => {
    window.print();
  };
  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
    sortEmployeeList();
  };

  useEffect(() => {
    sortEmployeeList();
  }, [sortingOption]);

  return (
    <div className="bg-[#0a192f] min-h-screen">
      <Navbar />

      <div className="bg-[#0a192f]">
        <div className="flex items-center justify-between print:hidden bg-[#0a192f]">
          <h1 className="text-2xl text-white font-bold mb-4 mx-auto ml-8">
            Employee List
          </h1>

          <input
            type="text"
            className="absolute left-[500px] top-13 bg-gray-100 rounded-2xl border border-gray-300 p-2 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-outline-blue h-9 mx-auto"
            placeholder="Search employee"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <label
            htmlFor="sorting option"
            className="text-white relative right-[400px]"
          >
            Sort BY:
          </label>
          <select
            className="relative right-[400px] border-black border-2 bg-gray-100"
            name="sortingOption"
            id="sortingOption"
            value={sortingOption}
            onChange={handleSortingChange}
          >
            <option value="name">Name</option>
            <option value="wages">Wages</option>
            <option value="date">Hire date</option>
          </select>
          <div>

          <label
            htmlFor="sorting option"
            className="text-white relative right-[300px]"
          >
            Position
          </label>
          <select
            className=" relative right-[290px]  border-black border-2 bg-gray-100"
            name="sortingOption"
            id="sortingOption"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">All</option>
            <option value="intern">intern</option>
            <option value="junior">junior</option>
            <option value="mid-level">mid-level</option>
            <option value="senior">senior</option>
          </select>
          </div>

          <div className="buttons p-3 mr-4 px-2 ">
            <button
              className=" border-2 rounded-2xl p-2 bg-green-400"
              onClick={printEmployeeList}
            >
              Download
            </button>
          </div>
        </div>

        <table className="w-11/12 mx-auto border border-slate-700 text-white mt-9 print:text-black">
          <thead>
            <tr className="border bg-slate-600 divide- border-slate-700 divide-slate-700 text-white print:text-black">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Hire Date</th>
              <th>Country</th>
              <th>Post</th>
              <th>Position</th>
              <th>Salary</th>
              <th className="print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {updateFilteredList().length === 0 && (
              <p className="  mx-auto text-xl font-bold text-gray-600  relative top-[200px] left-[50px] ">
                No employees found
              </p>
            )}

            {updateFilteredList().map((val, key) => (
              <tr
                key={key}
                className="border divide-x border-slate-700 divide-slate-700 mt-9 text-white print:text-black "
              >
                <td className="px-1 py-1 text-white print:text-black  font-medium">
                  {val.employeeid}
                </td>
                <td className="px-2 py-1 text-white  print:text-black font-mono font-medium">
                  {val.name}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.email}
                </td>
                <td className="px-1 border-spacing-0  text-white print:text-black font-mono font-medium">
                  {new Date(val.date).toLocaleDateString()}
                </td>
                <td className="px-2 py-1 text-white print:text-black  font-medium">
                  {val.country}
                </td>
                <td className="px-2 py-1 text-white print:text-black  font-medium">
                  {val.post}
                </td>
                <td className="px-2 py-1 text-white print:text-black  font-medium">
                  {val.position}
                </td>
                <td className="px-2 py-1 text-white print:text-black ffont-medium">
                  {val.wage}
                </td>
                <td className="px-1 py-1 text-white print:text-black font-medium print:hidden">
                  <div className=" w-1/2 flex items-center space-x-1">
                    <Link
                      to={`/employee/edit/${val.employeeid}/`}
                      className="rounded px-4 py-1 bg-blue-600 hover:bg-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded px-4 py-1 bg-red-600 hover:bg-red-800"
                      onClick={() => deleteEmployee(val.employeeid)}
                    >
                      Delete
                    </button>
                    <button
                      className="rounded px-4 py-1 bg-green-600 hover:bg-red-800"
                      onClick={() => viewEmployee(val)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEmployee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-s p-4 rounded-lg w-1/2 h-[500px] flex  items-center bg-[#0a192f] gap-28">
      <div>
        <img
          src={`http://localhost:3001/public/${selectedEmployee.photo}`}
          alt={selectedEmployee.name}
          className="w-[250px] h-[250px] rounded-3xl"
        />
        <h1 className="text-white text-2xl p-2 ml-3 mt-4">{selectedEmployee.name}</h1>
      </div>
      <div className="p-3 mb-9 text-white font-serif text-left w-[50%]">
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold p-1">Name:</label>
          <p className="bg-gray-500 rounded ml-4 p-1">{selectedEmployee.name}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Email:</label>
          <p>{selectedEmployee.email}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Employee ID:</label>
          <p>{selectedEmployee.employeeid}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Hire date:</label>
          <p>{new Date(selectedEmployee.date).toLocaleDateString()}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Country:</label>
          <p>{selectedEmployee.country}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Post:</label>
          <p>{selectedEmployee.post}</p>
        </div>
        <div className="flex mb-3 p-1 border-b border-gray-500">
          <label className="mr-2 font-bold">Position:</label>
          <p className="whitespace-nowrap">{selectedEmployee.position}</p>
        </div>
        <div className="flex mb-3 p-1">
          <label className="mr-2 font-bold">Wage:</label>
          <p>{selectedEmployee.wage}</p>
        </div>
      </div>
    </div>

    <button
      className="rounded px-4 py-1 bg-green-600 hover:bg-red-800 relative right-[400px] top-[200px]"
      onClick={() => setIsModalOpen(false)}
    >
      Close
    </button>
    <button
      className="rounded px-4 py-1 bg-green-600 hover:bg-red-800 relative right-[400px] top-[200px] ml-6"
      onClick={printIndividualRecord}
    >
      Print
    </button>
  </div>
)}
    </div>
  );
}