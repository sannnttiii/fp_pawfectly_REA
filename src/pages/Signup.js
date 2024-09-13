import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // console.log(password, confirmPassword);
      if (password === confirmPassword) {
        const response = await fetch("http://localhost:8082/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          localStorage.setItem("isLogin", true);
          localStorage.setItem("userID", data.user_id);
          navigate("/preprofile");
          console.log("Signup success");
        } else {
          console.error("Signup failed");
        }
      } else {
        setErrorAlert("❌ Password and confirm password should be the same.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-200">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray w-4/5">
          <h1 className="text-4xl font-semibold">Welcome!</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Please enter your details below to sign up.
          </p>
          <form onSubmit={handleSignup}>
            <div className="mt-8">
              <label className="text-lg font-medium">Email</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-1">
              <label className="text-lg font-medium">Password</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-1">
              <label className="text-lg font-medium">Confirm Password</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
              {errorAlert && <span className="errorAlert">{errorAlert}</span>}
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                className="w-full bg-orange-500 text-white text-lg font-bold py-3 rounded-xl hover:bg-orange-700"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className=" lg:flex h-full w-1/2 hidden relative items-center justify-center">
        {/* <div className="w-60 h-60 bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-full animate-bounce"></div> */}
        <div class="paw-print-1">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-2">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-3">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-4">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-5">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-6">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>
        {/* <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div> */}
      </div>
    </div>
  );
}
