import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("authToken") ? localStorage.getItem("authToken") : ""
  );

  useEffect(() => {
    localStorage.setItem("authToken", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full  bg-blue-200">
            <div className="w-[80%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base ">
              <Add />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;