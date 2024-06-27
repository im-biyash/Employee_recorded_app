
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Employees() {
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

  const [employeeList, setEmployeeList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortingOption, setSortingOption] = useState("name"); // Set default sorting to "name"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [totalMonthAttendance, setTotalMonthAttendance] = useState(null);
  const [monthAttendanceLogs, setMonthAttendanceLogs] = useState({});
  const [attendanceLogsModelOpen, setIsAttendanceLogsModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await axios.get("http://localhost:3001/employees");
        setEmployeeList(result.data);
      } catch (error) {
        console.log("error in getting daa from backend", error);
      }
    };
    fetchdata();
  }, []);

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
    if (!employeeList || employeeList.length === 0) {
      return [];
    }

    return employeeList.filter((employee) => {
      const nameMatches = employee.name
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const positionMatches = selectedPosition
        ? employee.position.toLowerCase() === selectedPosition.toLowerCase()
        : true;
      return nameMatches && positionMatches;
    });
  };

  const deleteEmployee = async (employeeid) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/delete/${employeeid}`
      );
  
      if (response.data.error) {
        console.error("Error deleting employee: " + response.data.error);
      } else {
        // Update the state immediately after successful deletion
        setEmployeeList((prevList) =>
          prevList.filter((employee) => employee.id !== employeeid)
        );
      }
    } catch (error) {
      console.error("Error deleting employee: " + error.message);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const viewEmployee = async (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  
    try {
      // Send a request to fetch the total month attendance for the current month
      const attendanceResponse = await axios.get(
        `http://localhost:3001/totalMonthAttendance/${employee.id}`
      );
      setTotalMonthAttendance(attendanceResponse.data);
  
      // Send a request to fetch the total month attendance for the previous month
    } catch (error) {
      console.error("Error fetching total month attendance: " + error.message);
    }
  };
  

  const handleDownload = () => {
    window.print();
  }
  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
    sortEmployeeList();
  };

  useEffect(() => {
    sortEmployeeList();
  }, [sortingOption]);

  const fetchMonthAttendanceLogs = async () => {
    try {
      console.log("Fetching month-wise attendance logs...");
      const monthLogsResponse = await axios.get(
        `http://localhost:3001/monthAttendanceLogs/${selectedEmployee.id}`
      );
      
      console.log(
        "Month-wise attendance logs fetched:",
        monthLogsResponse.data
      );
      setMonthAttendanceLogs(monthLogsResponse.data);
    } catch (error) {
      console.error(
        "Error fetching month-wise attendance logs: " + error.message
      );
    }
  };

  const handleOpen = async () => {
    console.log("Opening attendance logs modal...");
    try {
      setIsAttendanceLogsModalOpen(true);
      console.log("Attendance logs modal open:", setIsAttendanceLogsModalOpen);
      await fetchMonthAttendanceLogs();
    } catch (error) {
      console.error("Error opening attendance logs modal: " + error.message);
    }
  };

  const closeAttendanceLogsModal = () => {
    setIsAttendanceLogsModalOpen(false);
  };

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
            <button className=" border-2 rounded-2xl p-2 bg-green-400" onClick={handleDownload}>
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
              <th>Contact</th>
              <th>Hire Date</th>
              <th>Country</th>
              <th>Post</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Attendance</th>
              <th className="print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {updateFilteredList().length === 0 && (
              <tr className="mx-auto text-xl font-bold text-gray-600">
                <td colSpan="11" className="relative top-[200px] left-[50px]">
                  No employees found
                </td>
              </tr>
            )}

            {updateFilteredList().map((val, key) => (
              <tr
                key={key}
                className="border divide-x border-slate-700 divide-slate-700 mt-9 text-white print:text-black"
              >
                <td className="px-1 py-1 text-white print:text-black font-medium">
                  {val.id}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-mono font-medium">
                  {val.name}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.email}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.phone}
                </td>
                <td className="px-1 border-spacing-0 text-white print:text-black font-mono font-medium">
                  {new Date(val.date).toLocaleDateString()}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.country}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.post}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.position}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.wage}
                </td>
                <td className="px-2 py-1 text-white print:text-black font-medium">
                  {val.status === "Yes" ? (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Present
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Absent
                    </div>
                  )}
                </td>

                <td className="px-2 py-1 text-white print:text-black font-medium print:hidden">
                  <div className="w-1/2 flex items-center space-x-1">
                    <Link
                      to={`/employee/edit/${val.id}/`}
                      className="rounded px-4 py-1 bg-blue-600 hover:bg-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded px-4 py-1 bg-red-600 hover:bg-red-800"
                      onClick={() => deleteEmployee(val.id)}
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
          <div className="bg-s p-4 rounded-lg w-1/2 h-[600px] flex items-center bg-[#0a192f] gap-28">
            {selectedEmployee.photo && (
              <div>
                <img
                  src={`http://localhost:3001/public/${selectedEmployee.photo}`}
                  alt={selectedEmployee.name}
                  className="w-[250px] h-[250px] rounded-3xl"
                />
                <h1 className="text-white text-2xl p-2 ml-3 mt-4">
                  {selectedEmployee.name}
                </h1>
              </div>
            )}
            <div className="p-2 mt-4  text-white font-serif text-left w-[50%]">
              {selectedEmployee.name && (
                <div className="flex mb-3 p-1 border-b border-gray-500">
                  <label className="mr-2 font-bold p-1">Name:</label>
                  <p className="bg-gray-500 rounded ml-4 p-1">
                    {selectedEmployee.name}
                  </p>
                </div>
              )}
               {selectedEmployee.id && (
                <div className="flex mb-3 p-2 border-b border-gray-500">
                  <label className="mr-2 font-bold p-1">EmployeeID:</label>
                  <p className=" rounded ml-4 p-1">
                    {selectedEmployee.id}
                  </p>
                </div>
              )}
              {selectedEmployee.email && (
                <div className="flex mb-3 p-2 border-b border-gray-500">
                  <label className="mr-2 font-bold">Email:</label>
                  <p>{selectedEmployee.email}</p>
                </div>
              )}
              {selectedEmployee.post && (
                <div className="flex mb-3 p-2 border-b border-gray-500">
                  <label className="mr-2 font-bold">Post:</label>
                  <p>{selectedEmployee.post}</p>
                </div>
              )}
               {selectedEmployee.position && (
                <div className="flex mb-3 p-2 border-b border-gray-500">
                  <label className="mr-2 font-bold">Position:</label>
                  <p>{selectedEmployee.position}</p>
                </div>
              )}
                {selectedEmployee.wage && (
                <div className="flex mb-3 p-2 border-b border-gray-500">
                  <label className="mr-2 font-bold">Wage:</label>
                  <p>{selectedEmployee.wage}</p>
                </div>
              )}
              <div className="flex mb-3 p-2 border-b border-gray-500">
                <label className="mr-2 font-bold">Todays attendance</label>
                {selectedEmployee.status === "Yes" ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Present
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Absent
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  Total Month Attendance (Current Month):
                </p>
                <p className="text-white font-bold">
                  {totalMonthAttendance !== null
                    ? totalMonthAttendance.totalDaysPresent
                    : "Loading..."}
                </p>
              </div>
              <div>
                <button
                  className="mt-9 p-2 my-2 mx-3 bg-green-400 rounded text-black text-bold text-lg"
                  onClick={handleOpen}
                >
                  View attendance
                </button>
              </div>

             
              {attendanceLogsModelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                  <div className="bg-s p-4 rounded-lg w-1/2 h-[500px] flex items-center bg-[#0a192f] gap-28">
                    <div className="p-3 mb-9 text-white font-serif text-left w-[100%] mt-4">
                      <span className="text-white text-2xl bg-gray-400 rounded p-2 mx-auto">
                        Attendance Logs
                      </span>
                      <div className="flex flex-wrap w-full justify-between font-mono text-xl">
                        {" "}
                        {/* Ensure the flexbox takes full width and justify between */}
                        {monthsArray.map((month, index) => {
                          let totalDaysPresent = 0; // Define totalDaysPresent variable outside of the conditional

                          // Check if monthAttendanceLogs is an array
                          if (Array.isArray(monthAttendanceLogs)) {
                            // If it's an array, find the log for the current month
                            const monthLog = monthAttendanceLogs.find(
                              (log) => log.month === index + 1
                            );
                            // Set totalDaysPresent to 0 if the log is not found, otherwise set it to the found log's totalDaysPresent
                            totalDaysPresent = monthLog
                              ? monthLog.totalDaysPresent
                              : 0;
                          }

                          return (
                            <div key={index} className="w-[50%] ">
                              {" "}
                              {/* Adjust width to fit two columns */}
                              <div className="flex p-2 items-center">
                                {" "}
                                {/* Add 'items-center' to vertically center elements */}
                                <label className="mr-2 font-bold text-white">
                                  {month}:
                                </label>{" "}
                                {/* Remove 'p-1' from label */}
                                <p className="text-xl font-bold p-1 ">
                                  {totalDaysPresent}
                                  {
                                    // display cuurentMOnth if it is current month
                                    index  === currentMonth
                                      ? " (Current Month)"
                                      : ""
                                  }
                                </p>{" "}
                               
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className="rounded px-2 py-1 bg-blue-600 hover:bg-blue-800 ml-4 mt-8"
                        onClick={closeAttendanceLogsModal}
                      >
                        close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 mr-8">
                <button
                  className="bg-red-700 mt p-2 rounded-xl text-white"
                  onClick={closeModal}
                >
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}