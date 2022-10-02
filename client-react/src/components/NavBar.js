import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutRoute } from "../utils/APIRoutes";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(logoutRoute, {
        token,
      });
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert("You are not authenticated");
      }
    } catch (e) {
      if (e.response) {
        console.log("res error: ", e.message);
      } else if (e.request) {
        console.log("req err: ", e.message);
      } else if (e.message) {
        console.log("MESSAGE ERR: ", e.message);
      }
      // console.log(e)
      // alert("You are not authenticated.")
    }
  };

  return (
    <header className={styles.header}>
      <h1> Tic Tac Toe</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </header>
  );
};

export default NavBar;
