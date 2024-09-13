import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavMessageBottom({ onNewMessage }) {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const senderId = parseInt(localStorage.getItem("userID"));
  const { matchesId } = location.state || {};

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // Prevent sending empty message

    try {
      const response = await fetch(`http://localhost:8082/api/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, matchesId, senderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      console.log(message, matchesId, senderId);
      const data = await response.json();
      console.log(data);
      onNewMessage(data); // update UI after send text

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <nav className="fixed bottom-0 flex w-full h-20 flex-wrap items-center justify-between py-2 shadow-md bg-gray-100 lg:py-4">
        <form onSubmit={handleSendMessage} className="flex w-full px-4 ">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-grow rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 mr-2"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-orange-400 text-white hover:bg-yellow-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-yellow-600"
          >
            Send
          </button>
        </form>
      </nav>
    </div>
  );
}
