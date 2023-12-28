import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

export default function Navbar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000); // Set loading state to false after navigation
  };

  return (
    <div className="bg-slate-800 text-slate-50 print:hidden">
      {loading && (
        // Display ring loader only when loading state is true
        <div className="flex justify-center items-center h-screen">
          <RingLoader color="#36d68f" size={100} speedMultiplier={1} />
        </div>
      )}
      <div className="max-w-5xl flex justify-between items-center gap-3 mx-auto">
        <ul className="flex space-x-2 gap-3 items-center ml-7 ">
          <li className="font-serif text-xl text-red-600 hover:bg-slate-700 transition-all duration-300 p-2 rounded-md">
            <Link to="/home"> Home </Link>
          </li>
          <li className="hover:bg-slate-700 transition-all duration-300 p-2 rounded-md">
            <Link to="/about"> About</Link>
          </li>
          <li className="hover:bg-slate-700 transition-all duration-300 p-2 rounded-md">
            <Link to="/employee"> Employee </Link>
          </li>
          <div className="relative p-2 left-[700px]">
            <button
              className="inline-block px-2 py-2 text-white border-white border-1 rounded-2xl bg-slate-600 hover:bg-slate-700 transition-all duration-300"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}
