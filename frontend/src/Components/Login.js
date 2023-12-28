import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import backimage from "../Assets/backimage.jpg";

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
    } else {
      setUsernameError("");
    }
    if (password === "") {
      setPasswordError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });

      if (res.data === "success") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        navigate("/home");
      } else {
        setLoading(false);
        console.log(res);
        alert("You are not an admin");
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernamechange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handlePasswordchange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center h-screen bg-gray-800 bg-opacity-50">
          <RingLoader color="#36D7B7" loading={loading} size={50} />
        </div>
      )}

      <div className="min-h-screen bg-gray">
        <div className="flex items-center justify-center">
          <h1 className="text-bold text-4xl font-mono font-bold italic text-red-500 relative top-[50px] left-[60px] items-center mb-4">
            Employee Recorder Application
          </h1>
        </div>

        <div className="flex items-center justify-center mt-6">
          <div className="flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 relative">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-3 text-4xl font-bold">Welcome Back</span>
              <span className="font-bold text-blue-600">Login</span>
              <div className="py-4">
                <label htmlFor="username" className="mb-2">
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
                  <p className="text-bold text-red-600">{usernameError}</p>
                </span>
              </div>
              <div className="py-4">
                <label htmlFor="password" className="mb-2">
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

                  <p className="text-bold text-red-600">{passwordError}</p>

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
                  className="w-full bg-blue-600 rounded-lg p-2 text-white font-bold hover:bg-slate-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="right w-[400px] h-auto rounded">
              <img
                src={backimage}
                alt="User with laptop"
                className="w-full h-full rounded-3xl ml-9"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
