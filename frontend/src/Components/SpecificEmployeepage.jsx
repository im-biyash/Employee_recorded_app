// SpecificEmployeePage.js
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

  const handleAttendance = async () => {
    alert("Attendance marked successfully");
    setIsButtonDisabled(true);
    try {
      const currentTime = new Date();
      console.log("Current Time:", currentTime);

      if (
        lastAttendanceTime &&
        currentTime - new Date(lastAttendanceTime) < 24 * 60 * 60 * 1000
      ) {
        console.log("Attendance already marked within the last 24 hours.");
        return;
      }

      // Your logic for marking attendance, e.g., sending a request to the server
      const res = await axios.post("http://localhost:3001/markAttendance", {
        employeeId: id, // Include the employee ID in the request
      });

      // Check the response from the server
      if (res.data.message === "Attendance marked successfully") {
        // Update button state and last attendance time
        setIsButtonDisabled(true);
        setLastAttendanceTime(currentTime);
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
    <div className="flex justify-center mt-10">
      <div className="max-w-md p-8 bg-white border rounded-lg shadow-md relative right-[500px] top-[100px]">
        <h1 className="text-2xl font-bold mb-4">Welcome to your profile</h1>

        <div>
          <div className="">
            <img
              src={`http://localhost:3001/public/${employeeData.photo}`} // Assuming `photo` is the correct property name
              alt="Employee Photo"
              className="my-1 mx-auto rounded-full w-48 h-48 shadow-md"
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Your Name: {employeeData.name}
          </h2>
          <div className="flex p-1 ">
            <label className="text-xl font-semibold">Email:</label>
            <p className="mx-2 text-lg font-medium"> {employeeData.email}</p>
          </div>
          <div className="flex p-1 ">
            <label className="text-xl font-semibold">Contact::</label>
            <p className="mx-2 text-lg font-medium"> {employeeData.phone}</p>
          </div>  <div className="flex p-1 ">
            <label className="text-xl font-semibold">Hire Date:</label>
            <p className="mx-2 text-lg font-medium"> {employeeData.date}</p>
          </div>  <div className="flex p-1 ">
            <label className="text-xl font-semibold">Post</label>
            <p className="mx-2 text-lg font-medium"> {employeeData.post}</p>
          </div>
          
          {/* Display other employee information as needed */}
        </div>
        <div className="buttons">
          <button
            className={`bg-${isButtonDisabled ? "gray" : "green"}-400`}
            onClick={handleAttendance}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? "Attendance Marked" : "Mark Present"}
          </button>
          {isButtonDisabled && (
            <p className="text-xs mt-2">
              You can mark attendance again tomorrow
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificEmployeePage;
