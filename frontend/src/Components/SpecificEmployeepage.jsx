import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecificEmployeePage = () => {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [lastAttendanceTime, setLastAttendanceTime] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/getEmployeeData/${id}`
        );
        setEmployeeData(res.data);
      } catch (error) {
        console.error("Error while fetching employee data:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchEmployeeData();
  }, [id]);

  const [totalMonthAttendance, setTotalMonthAttendance] = useState(null);

  useEffect(() => {
    const fetchTotalMonthAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/totalMonthAttendance/${id}`
        );
        setTotalMonthAttendance(res.data.totalDaysPresent);
      } catch (error) {
        console.error("Error while fetching total month attendance:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchTotalMonthAttendance();
  }, [id]);
  // useEffect(() => {
  // //   const checkLastAttendanceTime = () => {
  // //     const currentTime = new Date();

  // //     if (
  // //       lastAttendanceTime &&
  // //       currentTime - new Date(lastAttendanceTime) < 24 * 60 * 60 * 1000
  // //     ) {
  // //       setIsButtonDisabled(true);
        
  // //     } else {
  // //       setIsButtonDisabled(false);
  // //     }
  // //   };

  // //   checkLastAttendanceTime();
  // // }, [lastAttendanceTime]);

  const handleAttendance = async (id) => {
    try {
      const currentTime = new Date();

      if (
        lastAttendanceTime &&
        currentTime - new Date(lastAttendanceTime) < 24 * 60 * 60 * 1000
      ) {
        console.log("Attendance already marked within the last 24 hours.");
        return;
      }

      // Your logic for marking attendance, e.g., sending a request to the server
      const res = await axios.post(
        `http://localhost:3001/markAttendance/${id}`,
        {
          employeeId: id, // Include the employee ID in the request
          status: "YES", // Include the status field
        }
      );

      // Check the response from the server
      if (res.data.message === "Attendance marked successfully") {
        // Update last attendance time
        setLastAttendanceTime(currentTime);
        // Disable the button
        setIsButtonDisabled(true);
      } else if (res.data.message === "Attendance already marked for today") {
        const lastAttendanceTime = new Date(res.data.lastAttendanceTime);
        if (currentTime - lastAttendanceTime < 24 * 60 * 60 * 1000) {
          console.log("Attendance already marked within the last 24 hours.");
          // Disable the button
          setIsButtonDisabled(true);
        } else {
          // Handle the case where attendance was marked more than 24 hours ago
        }
      } else {
        console.error("Failed to mark attendance:", res.data.message);
        // Handle the failure, display an error message, etc.
      }
    } catch (error) {
      console.error("Error while marking attendance:", error);
      // Handle error appropriately
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a192f]  flex justify-center items-center">
      <div className="bg-s p-2 border-2 rounded-lg w-1/2 h-[600px] flex items-center bg-slate-800 gap-28">
        <div>
          <img
            src={`http://localhost:3001/public/${employeeData.photo}`} // Assuming `photo` is the correct property name
            alt="Employee Photo"
            className="w-[250px] h-[250px] rounded-3xl"
          />
          <h2 className="text-lg text-white mb-2 mt-5 ">
            Your Name: <span className="bg-slate-500">{employeeData.name}</span>
          </h2>
        </div>
        <div className="p-2 mb-0 text-white font-serif text-left w-[60%]">
          {/* Add checks for each property */}
          <div className="heading  items-start  mb-9 relative right-[190px] ">
            <h1 className="text-3xl font-serif font-semibold">
              Welcome to your profile
            </h1>
          </div>
          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Name:</label>
            <p className=" rounded ml-4 text-lg p-1">{employeeData.name}</p>
          </div>

          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Email:</label>
            <p className=" rounded text-lg  ml-4 p-1">{employeeData.email}</p>
          </div>

          {/* Add checks for each property */}
          {/* ... (other property checks) */}

          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Contact:</label>
            <p className=" rounded ml-4 text-lg p-1">{employeeData.phone}</p>
          </div>

          <div className="flex mb-3 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Hire Date:</label>
            <p className="rounded ml-4 text-lg  p-1">{employeeData.date}</p>
          </div>

          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Country:</label>
            <p className=" rounded ml-4 text-lg  p-1">{employeeData.country}</p>
          </div>
          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Post:</label>
            <p className=" rounded ml-4 text-lg  p-1">{employeeData.post}</p>
          </div>
          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Position:</label>
            <p className=" rounded ml-4 text-lg p-1">{employeeData.position}</p>
          </div>
          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">Salary:</label>
            <p className="rounded ml-4 p-1">{employeeData.wage}</p>
          </div>
          {/* Display other employee information as needed */}
          <div className="flex mb-1 p-1 border-b border-gray-500">
            <label className="mr-2 font-bold p-1">
              Your present days this month:
            </label>
            <p className="mx-2 text-lg font-medium">
              {totalMonthAttendance !== null
                ? totalMonthAttendance
                : "Loading..."}
            </p>
          </div>
          <div className="buttons">
            {isButtonDisabled ? (
              <>
                <p className="text-lg font-semibold text-red-500">
                  Attendance already marked today
                </p>
                <p className="text-xs mt-2">
                  You can mark attendance again tomorrow
                </p>
              </>
            ) : (
              <button
                className="bg-green-400 text-black mt-2 rounded-lg p-1"
                onClick={() => handleAttendance(id)}
                disabled={isButtonDisabled}
              >
                Mark Present
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificEmployeePage;
