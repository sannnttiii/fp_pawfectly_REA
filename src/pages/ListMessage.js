import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RowMessage from "../components/RowMessage";

export default function ListMessage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const response = await fetch(
          `http://localhost:8082/api/listRoom?userID=${userID}`
        );
        const data = await response.json();
        console.log(data);
        setMessages(data.messages || []);
      } catch (error) {
        console.log("Error fetching messages:", error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <div className="w-full pt-0 bg-inherit shadow-md rounded-lg overflow-hidden">
        {messages.map((room) => (
          <RowMessage
            key={room.matchesId}
            idUserChoosen={room.userId}
            nameUserChoosen={room.nameUserChoosen}
            ageUserChoosen={room.ageUserChoosen}
            matchesId={room.matchesId}
            profilePic={room.profilePic}
            lastMessage={room.lastMessage}
            lastMessageTime={new Date(room.lastMessageTime).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          />
        ))}
      </div>
    </div>
  );
}
