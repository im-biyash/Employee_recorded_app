
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backimage from "../Assets/backimage.jpg";
import { RingLoader } from "react-spinners";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (username === "") {
    setUsernameError("Username is required");
   
  } 
  if (password === "") {
    setPasswordError("Password is required");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3001/login", {
      
        username: username,
        password: password,
   
    });

    if (res.data === "success") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 2000);
    } else {
      console.log(res);
      alert("You are not an admin");
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    alert("An error occurred during login. Please try again.");
    setLoading(false);
  }
  console.log("hey");
};

  const handleUsernamechange = (e) => {
    console.log(e.target.value);
    setUsername(e.target.value);
    setUsernameError(""); // Clear the error message
  };

  const handlePasswordchange = (e) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear the error message
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a192f]">
        <div className="flex  items-center justify-center ">          
          <h1 className="text-bold text-4xl font-mono font-bold italic relative top-[40px]  text-white  items-center mb-10">
            Employee Recorder Application
          </h1>
        </div>
        {loading && (
          // Display ring loader only when loading state is true
          <div className="flex justify-center items-center h-screen">
            <RingLoader color="#36d68f" size={200} speedMultiplier={1} />
          </div>
        )}
        <div className="flex items-center justify-center mt-6  ">
          <div className="flex flex-col m-6 space-y-8   border-2 border-gray-500 shadow-md rounded-3xl md:flex-row md:space-y-0 bg-[#0a192f]">
            <div className="flex flex-col justify-center p-8 md:p-14 ">
              <span className="mb-3 text-4xl text-white font-bold">
                Welcome Back
              </span>
              <span className="font-bold text-blue-600">Login</span>
              <div className="py-4">
                <label htmlFor="username" className="mb-2 text-white">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-2xl border border-gray-400"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernamechange}
                />
                <span style={{ minHeight: "16px" }}>
                  <p className="text-bold text-red-500">{usernameError}</p>
                </span>
              </div>
              <div className="py-4">
                <label htmlFor="password" className="mb-2 text-white">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl p-2 border border-gray-400"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordchange}
                  />

                  <p className="text-bold text-red-400">{passwordError}</p>

                  <span>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="absolute right-3 top-3 opacity-2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center py-4">
                <button
                  className="w-full bg-pink-500 rounded-lg p-2 text-white font-bold hover:bg-slate-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hidden md:block right w-[400px] h-auto rounded">
              <img
                src={backimage}
                alt="User with laptop"
                className="w-full h-full rounded-3xl ml-9 relative"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}