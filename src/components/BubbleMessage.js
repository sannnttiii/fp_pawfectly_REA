import React from "react";

const BubbleMessage = ({ message, isOwn }) => {
  const bubbleClasses = `rounded-lg p-4 mb-2 max-w-lg mt-2 ${
    isOwn
      ? "bg-yellow-300 text-gray-700 ml-auto"
      : "bg-gray-200 text-gray-700 mr-auto"
  }`;

  return (
    <div className={bubbleClasses}>
      <p>{message}</p>
    </div>
  );
};

export default BubbleMessage;
