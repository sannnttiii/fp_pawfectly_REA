import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function Preprofile() {
  const [petTypeIsDog, setPetType] = useState(true);
  const navigate = useNavigate();

  const id = parseInt(localStorage.getItem("userID"));

  const setPetTypeAndSave = async (isDog) => {
    setPetType(isDog);
    const petType = isDog ? "dog" : "cat";
    localStorage.setItem("petType", petType);

    try {
      const response = await fetch("http://localhost:8082/api/setPetType", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petType,
          id,
        }),
      });

      if (response.ok) {
        console.log("Pet type updated successfully");
        navigate("/profile");
      } else {
        console.error("Failed to update pet type");
      }
    } catch (error) {
      console.error("Error updating pet type:", error);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-orange-400 min-h-screen">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center text-white mb-12 pt-20">
            Select a partner for : Dog or Cat?
          </h2>
          <div className="flex justify-center">
            <button
              className="w-4/12 mr-10 transform origin-center transition hover:scale-110"
              onClick={() => setPetTypeAndSave(true)}
            >
              <img src="../images/dogprofile.jpeg" alt="Left Image" />
            </button>
            <button
              className="w-4/12 transform origin-center transition hover:scale-110"
              onClick={() => setPetTypeAndSave(false)}
            >
              <img
                className="justify-center items-center"
                src="../images/catprofile.jpeg"
                alt="Right Image"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preprofile;
