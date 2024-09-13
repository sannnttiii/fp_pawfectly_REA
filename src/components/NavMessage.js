import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavMessage() {
  const location = useLocation();
  const { idUserChoosen, nameUserChoosen, ageUserChoosen, profPicUserChoosen } =
    location.state || {};
  return (
    <div>
      <nav className="fixed w-full top-0 flex flex-wrap items-center justify-between h-20 px-6 bg-white shadow-md">
        <div className="flex items-center">
          <Link to={"/messages"}>
            <div className="transform w-full ">
              <img
                src="../images/back-arrow.svg"
                className="w-10 mr-6 "
                alt="Back"
              />
            </div>
          </Link>
          <div className=" rounded-full overflow-hidden">
            <img
              src={`http://localhost:8082/images/profpic/${profPicUserChoosen}`}
              className="w-12 h-12 mr-0"
              alt="Profile"
            />
          </div>
          <h1 className="text-xl font-medium ml-4 ">
            {nameUserChoosen}, {ageUserChoosen}th
          </h1>
        </div>
      </nav>
    </div>
  );
}
