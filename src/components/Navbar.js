import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  //isLogin state based on localStorage value
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePet, setImagePet] = useState("");

  // const toggleLogin = () => {
  //   console.log(JSON.parse(localStorage.getItem("isLogin")));
  //   // const newIsLogin = !isLogin;
  //   // setIsLogin(newIsLogin);

  //   // set value in localStorage
  //   if (newIsLogin) {
  //     localStorage.setItem("isLogin", JSON.stringify("isLogin"));
  //   } else {
  //     localStorage.setItem("isLogin", JSON.stringify("notLogin"));
  //   }
  //   console.log(JSON.parse(localStorage.getItem("isLogin")));
  // };

  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLogin(false);
    localStorage.setItem("isLogin", false);
    setIsDropdownOpen(false);
    console.log(localStorage.getItem("isLogin"));
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLogin");
    const storedImagePet = localStorage.getItem("imagePet");
    if (loginStatus) {
      setIsLogin(true);
      setImagePet(storedImagePet);
    } else {
      setIsLogin(false);
    }
  }, []);

  return (
    <nav className="flex items-center justify-between h-20 px-6 shadow-md">
      <Link to={"/"}>
        <div className=" transform w-full">
          <img src="../images/logo-raw.png" className="w-48 h-20" alt="Logo" />
        </div>
      </Link>

      {isLogin && imagePet ? (
        <div className="relative">
          <img
            src={`http://localhost:8082/images/profpic/${imagePet}`}
            alt="Image"
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <Link
                to={"/profile"}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to={"/messages"}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Chats
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to={"/login"}>
          <button
            className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 transform py-2 px-6 rounded-xl text-white font-semibold text-lg border-1 border-gray-100 w-full"
            // onClick={toggleLogin}
          >
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}
