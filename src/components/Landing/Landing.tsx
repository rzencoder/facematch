import React from "react";
import "./Landing.scss";
import image from "./landing.png";
import { Link } from "react-router-dom";

const Landing = () => (
  <div>
    <h1 className="landing-title">
      Face<span>Match</span>
    </h1>
    <p className="tagline">Detect faces in your favourite images</p>
    <img className="landing-img" alt="logo of five stick figures" src={image} />
    <div>
      <Link to="/signin">
        <button className="btn">Sign In</button>
      </Link>
      <Link to="/register">
        <button className="btn">Register</button>
      </Link>
    </div>
  </div>
);

export default Landing;
