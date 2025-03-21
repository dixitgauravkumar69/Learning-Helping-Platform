import React, { useState } from "react";
import "./Styles.css";
import { NavLink, useNavigate } from "react-router-dom";
import Images from "../Images/Grammar-correction.svg";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";

const Signup = () => {
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userType, setUserType] = useState("");  // teacher or student
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErr("");

    const newErrors = {};

    if (!Firstname.trim()) newErrors.Firstname = "First name is required";
    if (!Lastname.trim()) newErrors.Lastname = "Last name is required";

    if (!Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.Email = "Invalid email format";
    }

    if (!Password.trim()) {
      newErrors.Password = "Password is required";
    } else if (Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long";
    }

    if (!userType) {
      newErrors.userType = "Please select a user type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = { Firstname, Lastname, Email, Password, userType };

    try {
      const url = userType === "teacher" 
        ? `http://localhost:8000/api/teacher/signup` 
        : `http://localhost:8000/api/student/signup`;  // Based on userType

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Debug the raw response
      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);

      // Handle empty or invalid JSON response
      let responseData;
      try {
        responseData = textResponse ? JSON.parse(textResponse) : {};
      } catch (error) {
        console.error("JSON Parsing Error:", error, "Response:", textResponse);
        setErr("Unexpected server response. Please try again later.");
        return;
      }

      if (response.ok) {
        navigate("/varifyEmail"); // Adjust navigation based on user type
      } else {
        setErrors(responseData.errors || {});
        setErr(responseData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErr("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="section">
        <article className="article">
          <div className="header">
            <h3 className="head">WELCOME</h3>
            <h4 className="Sub-head">Join us today !!</h4>
          </div>

          <div className="inpts">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-x input-4"
                placeholder="First name"
                value={Firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.Firstname && <div className="error-message">{errors.Firstname}</div>}

              <input
                type="text"
                className="input-x input-5"
                placeholder="Last name"
                value={Lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.Lastname && <div className="error-message">{errors.Lastname}</div>}

              <input
                type="email"
                className="input-x input-6"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.Email && <div className="error-message">{errors.Email}</div>}

              <input
                type="password"
                className="input-x input-7"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.Password && <div className="error-message">{errors.Password}</div>}

              <div className="rad-btns">
                <Radiobtn userType={userType} setUserType={setUserType} />
              </div>
              {errors.userType && <div className="error-message">{errors.userType}</div>}

              <div className="signupage">
                <span>Already have an account? </span>
                <NavLink to="/Login" className="link">
                  Login
                </NavLink>
              </div>

              <div className="btn">
                <button type="submit" className="btn-4">Signup</button>
              </div>
            </form>

            {err && <div className="error-message">{err}</div>}
          </div>
        </article>

        <div className="right-part">
          <img src={Images} alt="Signup Illustration" className="imgs" />
        </div>
      </div>
    </>
  );
};

export default Signup;
