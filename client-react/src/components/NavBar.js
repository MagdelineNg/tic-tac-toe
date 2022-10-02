import axios from "axios";
import React from "react";
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
      alert("You are not authenticated.");
    }
  };

  return (
    <header className={styles.header}>
      <h1> Tic Tac Toe</h1>
      <button
        aria-label="logout"
        tabindex="0"
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </button>
    </header>
  );
};

export default NavBar;
