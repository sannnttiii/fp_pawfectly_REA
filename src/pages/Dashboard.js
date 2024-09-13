import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { IoPawSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

function Dashboard() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(localStorage.getItem("isLogin"));
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      {/* <div className="bg-orange-400 min-h-screen"></div> */}
      <section className="h-screen bg-orange-400 flex  flex-col items-center justify-center">
        <div className="flex items-center justify-between h-auto w-full max-w-screen-lg px-16">
          <div className="text-left">
            <h1 className="text-8xl font-bold text-white">Pawfectly</h1>
            <div className="flex items-center mt-4">
              <IoPawSharp
                alt="Paw Print"
                className="w-12 h-12 mr-4 text-white"
              />
              <p className="text-2xl text-white">Find your pawfect match!</p>
            </div>
          </div>
          <div className="relative w-96 h-96">
            <img
              src="../images/2dogs.jpg"
              alt="Dogs"
              className="object-cover w-full h-full rounded-full shadow-lg"
            />
          </div>
        </div>
        <div className="justify-center pt-6">
          <Link to={!isLogin | (isLogin === "false") ? "/login" : "/homepage"}>
            <button className="flex items-center justify-center bg-white text-yellow-500 hover:scale-110 transform py-4 px-20 rounded-full font-semibold text-lg border-1 border-gray-100 w-full">
              Start Matching
            </button>
          </Link>
        </div>
      </section>

      <section className="flex-grow bg-white">
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold text-center ">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid:cols-2 lg:grid-cols-3">
            <div className="rounded-xl shadow-lg mr-4 mb-4">
              <div className="p-4 flex flex-col">
                <div className="p-4 text-3xl font-bold text-center border-b-4">
                  <img
                    className="w-30 h-28 rounded-full mx-auto py-0 my-2"
                    src="../images/testi1.jpeg"
                    alt="testi1"
                  />
                  Haruka
                </div>
                <ul className="w-full text-center text-sm">
                  <li className="border-b py-4 px-4">
                    I can't thank Pawfectly enough for helping me find the
                    perfect match for my energetic pup. Haruka is now a happy
                    and playful member of our family!
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl shadow-lg mr-4 mb-4">
              <div className="p-5 flex flex-col">
                <div className="p-4 text-3xl font-bold text-center border-b-4">
                  <img
                    className="w-30 h-28 rounded-full mx-auto py-0 my-2"
                    src="../images/testi3.jpeg"
                    alt="testi3"
                  />
                  Oddy
                </div>
                <ul className="w-full text-center text-sm">
                  <li className="border-b py-4 px-4">
                    Thanks to Pawfectly, I found the purrfect companion for my
                    lonely cat. Now, Oddy is happier than ever with their new
                    feline friend!
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl shadow-lg mr-4 mb-4">
              <div className="p-5 flex flex-col">
                <div className="p-4 text-3xl font-bold text-center border-b-4">
                  <img
                    className="w-30 h-28 rounded-full mx-auto py-0 my-2"
                    src="../images/testi2.jpeg"
                    alt="testi2"
                  />
                  Hachi
                </div>
                <ul className="w-full text-center text-sm">
                  <li className="border-b py-4 px-4">
                    Pawfectly, you've got a loyal user in me! Hachi is happier
                    and found his soulmate from Pawfectly App!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
