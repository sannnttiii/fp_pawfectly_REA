import React, { useState } from "react";
import MatchPopup from "./MatchPopup";

export default function CardPet(pet) {
  const [modal, setModal] = useState(false);
  const idLogin = parseInt(localStorage.getItem("userID"));
  const [matchesId, setMatchesId] = useState(null);

  const handleLove = (idChoosen) => {
    const setMatch = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/setMatch?userid1=${idLogin}&userid2=${idChoosen}&status=match`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (data.respons === "match") {
          setMatchesId(data.matchesId);
          setModal(!modal);
        }
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
    setMatch();
    window.location.reload();
    if (modal) {
      setModal(!modal);
    }
  };
  const handleCancel = (idChoosen) => {
    const setUnmatch = async () => {
      try {
        const idLogin = parseInt(localStorage.getItem("userID"));

        const response = await fetch(
          `http://localhost:8082/api/setMatch?userid1=${idLogin}&userid2=${idChoosen}&status=unmatch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
    setUnmatch();
  };

  return (
    <div className="rounded-xl shadow-lg mr-4 mb-4">
      <div className="p-5 flex flex-col">
        <div className="rounded-xl over">
          <img
            src={`http://localhost:8082/images/profpic/${pet.item.image_pet}`}
            alt="Image"
          />
        </div>
        <h3 className="text-2xl md:text-3xl font-medium mt-3">
          {pet.item.name}, {pet.item.age}yo
        </h3>
        <div className="flex justify-between items-stretch text-sm text-slate-600">
          <p>{pet.item.city}</p> <p>{pet.item.petBreeds}</p>
        </div>
        <p className="text-slate-500 mt-3">{pet.item.bio}</p>
      </div>
      <div className="m-auto mb-4 mt-0 flex justify-center">
        <button
          className="w-14 h-14 mr-4 transition hover:scale-110 "
          onClick={() => handleLove(pet.item.id)}
        >
          <img
            src="../images/love.svg"
            alt="Love Icon"
            className="w-full h-full object-cover rounded-full"
          />
        </button>
        <button className="w-14 h-14  transition hover:scale-110">
          <img
            src="../images/cancel.svg"
            alt="Cancel Icon"
            className="w-full h-full object-cover rounded-full"
            onClick={() => handleCancel(pet.item.id)}
          />
        </button>
      </div>
      {/* {modal && <MatchPopup toggleModal={() => setModal(false)} />} */}
      <MatchPopup
        toggleModal={() => handleLove(pet.item.id)}
        modal={modal}
        idUserChoosen={pet.item.id}
        ageUserChoosen={pet.item.age}
        nameUserChoosen={pet.item.name}
        profPicUserChoosen={pet.item.image_pet}
        matchesId={matchesId}
      />
    </div>
  );
}
