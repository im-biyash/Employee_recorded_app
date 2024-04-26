import React, { useEffect, useState } from "react";
import EmployeePieChart from "./Employeepiechart";
import Navbar from "./Navbar";
import Typed from "react-typed";
import companyimage from "../Assets/company.jpeg";
const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [totalAbsentToday, setTotalAbsentToday] = useState(0);
  const [isModelopen,setIsmodelopen]=useState(false);



const openModel = ()=>{
  setIsmodelopen(true);
}



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
        console.log(data);
      } catch (error) {
        console.error("Error fetching employee data:", error.message);
      }
    };

   

    const fetchTotalAbsentToday = async () => {
      try {
        const result = await fetch("http://localhost:3001/employees");
        const data = await result.json();
  
        // Filter employees whose status is "Absent"
        const absentEmployees = data.filter(employee => employee.status === "Absent");
        console.log(absentEmployees);
  
        // Update the state with the filtered absent employees
        setEmployeeList(absentEmployees);
        setTotalAbsentToday(absentEmployees.length);
      } catch (error) {
        console.error("Error fetching total absent today data:", error.message);
      }
    };
  
    // ...
  fetchData();
  fetchEmployeeData();

    fetchTotalAbsentToday();
  }, []);

  const totalEmployees = chartData.reduce(
    (total, item) => total + item.count,
    0
  );

  return (
   
    <div className="bg-[#0a192f] h-screen text-white">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-center">CodeNexa Innovations</h1>

      <Typed
        className="typed-text text-4xl text-white relative left-[600px] top-[0px]"
        strings={["Welcome back! Admin"]}
        typeSpeed={100}
        backSpeed={100}
        loop
      />

      <div className="flex align-center justify-space-between space-x-12 mt-6">
        <div className="bg-slate-700 h-29 w-1/5 border-spacing-1 rounded-2xl">
          <h1 className="text-3xl text-white font-bold ml-8 mt-600">
            Total Employees:<br></br>
            <span className="ml-28 text-red-500">{totalEmployees}</span>
          </h1>
        </div>

    

        <div className="bg-slate-700 h-29 w-1/5 border-spacing-1 rounded-2xl hover:bg-slate-300"onClick={openModel}>
          <h1 className="text-3xl text-white font-bold ml-8 mt-600">
            Absent today :<br></br>
            <span className="ml-28 text-red-500">{totalAbsentToday}</span>
          </h1>
        </div>
      </div>
       
          <div className="flex gap-60 p-3">

      <div className="about-chart flex- gap-6 relative top-[200px] ">
        <h2 className="text-xl font-mono">Employee distribution by position</h2>
        <EmployeePieChart
          data={chartData}
          className="text-white p-2 relative top-[300px]"
        />
      </div>
      <div className="text-3xl font-bold mb-4 ">
         <img src ={companyimage} alt="" className="w-[600px] h-[450px] ml-9 "/>
        </div>
</div>

      {isModelopen && (
  <div
    className="bg-slate-700 h-1/2 w-1/2 text-white relative bottom-[400px] left-[350px]"
    style={{ maxHeight: '80vh', overflowY: 'auto' }}
  >
    <h1 className="text-3xl font-bold mb-4 text-red-500">Absent today</h1>
    {employeeList.map((absentemployee) => (
      <div
        key={absentemployee.id}
        className="bg-slate-700 text-white mb-2 p-2 rounded max-w-full mb-"
      >
            <div className="items flex gap-2 items-center text-xl">
              <img
                src={`http://localhost:3001/public/${absentemployee.photo}`}
                alt={absentemployee.name}
                className="w-14 h-16 rounded-full overflow-hidden m-1 "
              />
              <div className="flex flex-row gap-4">
                <p>{absentemployee.id}</p>
                <p>{absentemployee.name}</p>
                <p>{absentemployee.email}</p>
                <p>{absentemployee.phone}</p>
              </div>
            </div>
          </div>
        ))}
        <button className="bg-red-500 p-2 rounded" onClick={() => setIsmodelopen(false)}>
          Close
        </button>
      </div>
    )}

      
    </div>
  );
};

export default Home;
