import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import styles from "../styles/Register.module.css";
import {GameContext} from '../GameContext'
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
  const navigate = useNavigate();
  const {currentUser, setCurrentUser} = useContext(GameContext)

  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    console.log("regex test", USER_REGEX.test(user));

    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    //axios returns obj with .data property
    //obj destructuring
    try {
      const response = await axios.post(
        registerRoute,
        {
          user,
          password: pwd,
          //socketId: null,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if( response.data.status===false){
        setErrMsg("Username is taken!")
        errRef.current.focus()
        return
      }
      setCurrentUser(user)
      console.log(response.data);


      // localStorage.setItem("current-user", JSON.stringify(response.data.newUser));
      // console.log(localStorage.getItem("current-user"))

      //clear state and controlled inputs
      setUser("");
      setPwd("");
      setMatchPwd("");
      navigate("/joingame")

    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      }  else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  }

//     if (response.data.status === false) {
//       setErrMsg(response.data.msg);
//       errRef.current.focus();
//     }

//     console.log("user reg validated");

//     if (response.data.status === true) {
//       //localStorage.setItem("new-user-local", JSON.stringify(data.user));
//       navigate("/");
//     }
//   };

  //       console.log("response", data)
  //       //console.log(response.status)
  //       //console.log(JSON.stringify(response?.data));
  //       //console.log(JSON.stringify(response))

  //     } catch (err) {
  //       if (!err?.response) {
  //         setErrMsg("No Server Response");
  //       } else if (err.response?.status === 409) {
  //         setErrMsg("Username Taken");
  //       } else {
  //         console.log(err);
  //         setErrMsg("Registration Failed");
  //       }
  //       errRef.current.focus();
  //     }
  //   };

  return (
    <div className="mainContainer">
      <div className="loginContainer">
        <div className={styles.logoContainer}>Welcome to Tic Tac Toe!</div>
        <p
          ref={errRef}
          className={errMsg ? "warning" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <div className={styles.inputContainer}>
          <h1>Register</h1>

          <label htmlFor="username">
            Username:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validName ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validName || !user ? "hide" : "invalid"}
            />
          </label>
          <input
            className={styles.loginInput}
            placeholder="Username"
            type="text"
            id="username"
            ref={userRef}
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />

          <p
            id="uidnote"
            className={
              userFocus && user && !validName ? "warning" : "offscreen"
            }
          >
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>

          <label htmlFor="password">
            Password:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !pwd ? "hide" : "invalid"}
            />
          </label>
          <input
            className={styles.loginInput}
            placeholder="Password"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p
            id="pwdnote"
            className={pwdFocus && !validPwd ? "warning" : "offscreen"}
          >
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validMatch || !matchPwd ? "hide" : "invalid"}
            />
          </label>
          <input
            className={styles.loginInput}
            type="password"
            placeholder="Retype password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            id="confirmnote"
            className={matchFocus && !validMatch ? "warning" : "offscreen"}
          >
            Must match the first password input field.
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.loginButton} onClick={handleRegister}>
            Register
          </button>
        </div>
        <p className={styles.registerContainer}>
          Already have an account?
          <br />
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
