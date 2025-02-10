import React, { useState, useEffect } from "react";
import LoginPage from "./LoginForm";
import { isAdmin } from "../javaScript/functions.js";
import { toast } from "react-toastify";
import Loader from "./loader";
import Mynav from "./Mynav";

export default function Dashboard() {
  const [isloggedIn, setIsLoggedIn] = useState(
    false || ((localStorage.getItem("loggedIn") === "true") && localStorage.getItem("email") !== "")
  );
  const [admin, setAdmin] = useState(false);
  const [showEmpPanel, setShowEmpPanel] = useState(false);
  
  //custom confirmation dialog box for toast
  const ConfirmationDialog = ( callback ) => (
    <div className="ml-2">
      <p className="font-semibold mb-2"> Sure ! want to logout ?</p>
      <button
        className="bg-red-500 text-white font-bold px-3 py-1 rounded"
        onClick={()=>{ logout();callback(); }}
      >
        Yes
      </button>
      <button
      className="bg-gray-200 text-black font-bold px-3 py-1 ml-2 rounded"
        onClick={() => {
          toast.dismiss("confirmation"); // Dismiss the confirmation dialog
        }}
      >
        No
      </button>
    </div>
  );
  
  //Check that logged in user is Admin or not
  useEffect(() => {
    if (isloggedIn) {
      isAdmin(localStorage.getItem("email"), (e) => {
        setAdmin(e);
        if (!e) {
          setTimeout(() => {
            setShowEmpPanel(true);
          }, 1000);
        }
      });
    }
  }, [isloggedIn]);

  //to logout the user
  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.dismiss("confirmation");

    toast.success("Logged out successfully !!", {
      toastId: "loggedout",
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  //Confirm that want to logout or not
  function confirmation( callback ){
    toast.info( ConfirmationDialog (callback),{
      toastId:"confirmation",
      autoClose:false
    })
  }

  //Returning Panel as per login
  if (isloggedIn) {
    if (admin) {
      return <Mynav logout={confirmation} panel="Admin"  />;
    } else if (showEmpPanel) {
      return <Mynav logout={confirmation} panel="User"/>;
    } else {
      return <Loader/>; // You can return a loading indicator here if needed
    }
  } 
  else {
    return (
      <>
        <LoginPage />
      </>
    );
  }
}
