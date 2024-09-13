import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin");
  console.log(isLogin);
  if (!isLogin | (isLogin === "false")) {
    console.log(isLogin);
    return <Navigate to={"/login"}></Navigate>;
  }
  return children;
}
