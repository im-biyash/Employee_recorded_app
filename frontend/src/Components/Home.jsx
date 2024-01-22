import React, { useEffect, useState } from 'react';
import EmployeePieChart from './Employeepiechart';
import Navbar from './Navbar';
import Typed from 'react-typed';

const Home = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('http://localhost:3001/employeeChartData');
        const data = await result.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error.message);
      }
    };

    fetchData();
  }, []);

  // Calculate total number of employees
  const totalEmployees = chartData.reduce((total, item) => total + item.count, 0);

  return (
    <div className='bg-[#0a192f] h-screen text-white'>
      <Navbar/>
      <h1 className='text-4xl font-bold mb-4 text-center'>Beta company</h1>
      
      <Typed className="typed-text text-4xl  text-white relative left-[600px] top-[60px]" strings={['Welcome back! Admin']} typeSpeed={100} backSpeed={100} loop />

      <div className="about-chart flex-col gap-6 relative top-[200px] ">
        
        
        {/* Display total number of employees */}
        <h1 className='text-3xl ml-8 mb-3 color-red'>Total Employees: {totalEmployees}</h1>
        
        <EmployeePieChart data={chartData} className="text-white p-2 relative top-[300px]" />
        <h2>Employee Distribution by Position</h2>
      </div>
    </div>
  );
};

export default Home;
