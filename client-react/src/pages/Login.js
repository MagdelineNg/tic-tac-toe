import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Login.module.css";
import { loginRoute } from "../utils/APIRoutes";
import {GameContext} from '../GameContext'

const Login = () => {
  const {currentUser, setCurrentUser} = useContext(GameContext)
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (user === "" || pwd === "") {
      setErrMsg("Email and password are required.");
      return;
    }

    setUser("");
    setPwd("");

    try {
      const response = await axios.post(
        loginRoute,
        {
          user,
          password: pwd,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === false) {
        setErrMsg(response.data.msg);
        errRef.current.focus();
      } else{
        localStorage.setItem('auth_token', response.data.token)
        setCurrentUser(user)
        navigate("/joingame");
      }
    } catch (err) {
        console.log(err.message)
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        console.log(err)
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="mainContainer">
      <div className="loginContainer">
        <h1 className={styles.logoContainer} >Welcome to Tic Tac Toe!</h1>
        <p
          ref={errRef}
          className={errMsg ? "warning" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <div className={styles.inputContainer}>
          <h1 tabIndex="0">Login</h1>
          <label htmlFor="username">Username:</label>
          <input
            className={styles.loginInput}
            placeholder="username"
            type="text"
            id="username"
            ref={userRef}
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            className={styles.loginInput}
            placeholder="Password"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          <button aria-label="Login" className={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        </div>
        <p className={styles.registerContainer}>
          New User?
          <br />
          <Link to="/" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
