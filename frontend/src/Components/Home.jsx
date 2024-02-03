import React, { useEffect, useState } from "react";
import EmployeePieChart from "./Employeepiechart";
import Navbar from "./Navbar";
import Typed from "react-typed";

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:3001/employeeChartData");
        const data = await result.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error.message);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const result = await fetch("http://localhost:3001/employees");
        const data = await result.json();
        setEmployeeList(data);
      } catch (error) {
        console.error("Error fetching employee data:", error.message);
      }
    };

    fetchData();
    fetchEmployeeData();
  }, []);

  const totalEmployees = chartData.reduce(
    (total, item) => total + item.count,
    0
  );

  return (
    <div className="bg-[#0a192f] h-screen text-white">
      <Navbar />
      <h1 className="text-5xl font-bold mb-4 text-center">Biyash company</h1>

      <Typed
        className="typed-text text-4xl  text-white relative left-[600px] top-[60px]"
        strings={["Welcome back! Admin"]}
        typeSpeed={100}
        backSpeed={100}
        loop
      />

      <div className="about-chart flex-col gap-6 relative top-[200px] ">
        <h1 className="text-3xl ml-8 mb-3 color-red">
          Total Employees: {totalEmployees}
        </h1>
        <EmployeePieChart
          data={chartData}
          className="text-white p-2 relative top-[300px]"
        />
        <h2>
          
        </h2>
      </div>

      <div className="newmember relative left-[700px] h-1/3 col-span-3 w-1/4 border rounded-2xl border-white bg-slate-700">
        <h1 className="text-2xl font-semibold text-white">New Members</h1>
        <div className="flex flex-wrap justify-center">
          {employeeList.slice(0, 5).map((employee) => (
            <div
              key={employee.employeeid}
              className="w-14 h-16 rounded-full overflow-hidden m-1 mr-4"
            >
              <img
                src={`http://localhost:3001/public/${employee.photo}`}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
              <p className="text-sm text-white text-center mt-1">
              {employee.name.split(" ")[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
