import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8082/api/login", {
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
        localStorage.setItem("userID", data.user_id);
        localStorage.setItem("imagePet", data.image_pet);

        localStorage.setItem("petType", data.petType);
        localStorage.setItem("isLogin", true);
        navigate("/homepage");
        console.log("successfully login");
      } else {
        console.error("Login failed");
        setErrorAlert(
          "❌ Login failed. Please ensure your email and password are correct."
        );
      }
    } catch (error) {
      console.error("Error Login:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-200">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray w-4/5">
          <h1 className="text-4xl font-semibold">Welcome Back</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Welcome back! please enter your details.
          </p>
          <form onSubmit={handleLogin}>
            <div>
              <div className="mt-8">
                <label className="text-lg font-medium">Email</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-lg font-medium">Password</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                />
              </div>
              {errorAlert && <span className="errorAlert">{errorAlert}</span>}

              {/* <div className="mt-4 flex items-end justify-end">
                <button className="font-normal text-base text-orange-500 ">
                  Forgot Password?
                </button>
              </div> */}
              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  className=" w-full bg-orange-500 text-white text-lg font-bold py-3 rounded-xl hover:bg-orange-700"
                  type="submit"
                >
                  Sign In
                </button>

                <Link to={"/signup"}>
                  <button className="flex items-center justify-center gap-2  hover:bg-gray-100 transform py-4  rounded-xl text-gray-700 font-semibold text-lg border-2 border-gray-100 w-full">
                    {/* <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                  fill="#EA4335"
                />
                <path
                  d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                  fill="#34A853"
                />
                <path
                  d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                  fill="#4A90E2"
                />
                <path
                  d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                  fill="#FBBC05"
                />
              </svg> Sign in with Google*/}
                    Create an account
                  </button>
                </Link>
              </div>
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

export default Login;
