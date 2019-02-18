import React, { Component } from "react";
import "./Navigation.scss";
import face from "./face.png";
import { Link } from "react-router-dom";

interface NavProps {
  isSignedIn: boolean;
  handleSignOut: any;
}

class Navigation extends Component<NavProps> {
  render() {
    return (
      <div className="nav-container">
        <div className="logo-container">
          <div>
            <Link to="/">
              <img className="logo" src={face} alt="" />
            </Link>
          </div>
          <div className="logo-text">
            Face<span>Match</span>
          </div>
        </div>
        {this.props.isSignedIn ? (
          <nav className="nav">
            <Link to="/profile">
              <p>Profile</p>
            </Link>
            <p onClick={() => this.props.handleSignOut()}>Sign Out</p>
          </nav>
        ) : (
          <nav className="nav">
            <Link to="/signin">
              <p>Sign In</p>
            </Link>
            <Link to="register">
              <p>Register</p>
            </Link>
          </nav>
        )}
      </div>
    );
  }
}

export default Navigation;
