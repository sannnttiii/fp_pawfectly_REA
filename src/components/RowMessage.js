import React from "react";
import { Link, useNavigate } from "react-router-dom";

function RowMessage({
  idUserChoosen,
  nameUserChoosen,
  ageUserChoosen,
  profilePic,
  matchesId,
  lastMessage,
  lastMessageTime,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/message", {
      state: {
        idUserChoosen: idUserChoosen,
        nameUserChoosen: nameUserChoosen,
        ageUserChoosen: ageUserChoosen,
        profPicUserChoosen: profilePic,
        matchesId: matchesId,
      },
    });
  };
  return (
    <div className="flex items-center p-4 border-b" onClick={handleClick}>
      <img
        src={`http://localhost:8082/images/profpic/${profilePic}`}
        alt="Image"
        className="w-14 h-14 rounded-full mr-4"
      />
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {nameUserChoosen}, {ageUserChoosen}yo
            </p>
          </div>
          <p className="text-xs text-gray-500">{lastMessageTime}</p>
        </div>
        <p className="text-md text-gray-800 mt-1">{lastMessage}</p>
      </div>
    </div>
  );
}

export default RowMessage;
