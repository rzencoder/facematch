import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ImageForm from "../components/ImageForm/ImageForm";
import Navigation from "../components/Navigation/Navigation";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import Rank from "../components/Rank/Rank";
import SignIn from "../components/SignIn/SignIn";
import Home from "../components/Home/Home";
import Landing from "../components/Landing/Landing";
import Profile from "../components/Profile/Profile";

interface AppProps {}

const initialState = {
  isSignedIn: false,
  message: "",
  id: 0,
  name: "",
  username: "",
  entries: 0,
  joined: new Date(),
  avatar: "1",
  location: ""
};

interface AppState {
  isSignedIn: boolean;
  message: string;
  id: number;
  name: string;
  username: string;
  entries: number;
  joined: string;
  avatar: string;
  location: string;
}
type State = Readonly<typeof initialState>;

class App extends Component {
  readonly state: State = initialState;

  private loadUser = (data: any): void => {
    this.setState(
      {
        isSignedIn: true,
        id: data.id,
        username: data.username,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
        avatar: data.avatar,
        location: data.location
      },
      () => console.log(this.state)
    );
  };

  updateEntries = (data: number) => {
    this.setState({ entries: data });
  };

  handleSignOut = () => {
    const token = window.sessionStorage.getItem("token");
    window.sessionStorage.removeItem("token");
    if (token) {
      fetch("/signout", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          console.log(this.state);
          this.setState({
            isSignedIn: false
          });
        });
    }
  };

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                authorization: token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.username) {
                  console.log(user);
                  this.loadUser(user);
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  render() {
    const {
      isSignedIn,
      id,
      name,
      username,
      location,
      avatar,
      entries,
      joined
    } = this.state;
    const homeRoute = isSignedIn ? Image : Home;
    return (
      <Router>
        <div className="App">
          <Navigation
            isSignedIn={isSignedIn}
            handleSignOut={this.handleSignOut}
          />

          {!isSignedIn ? (
            <Route exact path="/" component={Landing} />
          ) : (
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  {...props}
                  name={name}
                  id={id}
                  entries={entries}
                  updateEntries={this.updateEntries}
                />
              )}
            />
          )}
          <Route
            path="/signin"
            render={props => (
              <SignIn
                {...props}
                loadUser={this.loadUser}
                isSignedIn={isSignedIn}
              />
            )}
          />
          <Route
            path="/register"
            render={props => (
              <SignIn
                {...props}
                loadUser={this.loadUser}
                isSignedIn={isSignedIn}
              />
            )}
          />
          <Route
            path="/profile"
            render={props => (
              <Profile
                {...props}
                name={name}
                username={username}
                id={id}
                city={location}
                entries={entries}
                avatar={avatar}
                joined={joined}
                isSignedIn={isSignedIn}
                loadUser={this.loadUser}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
