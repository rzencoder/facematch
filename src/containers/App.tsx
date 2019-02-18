import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import SignIn from "../components/SignIn/SignIn";
import Home from "./Home/Home";
import Landing from "../components/Landing/Landing";
import Profile from "../components/Profile/Profile";

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

type State = Readonly<typeof initialState>;

class App extends Component {
  readonly state: State = initialState;

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    //Signin automatically if user has authorization token
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
                  this.loadUser(user);
                }
              });
          }
        })
        .catch(() => {
          this.setState({
            message: "Error Loading profile"
          });
        });
    }
  }

  loadUser = (data: any): void => {
    this.setState({
      isSignedIn: true,
      id: data.id,
      username: data.username,
      name: data.name,
      entries: data.entries,
      joined: data.joined,
      avatar: data.avatar,
      location: data.location
    });
  };

  updateEntries = (data: number): void => {
    this.setState({ entries: data });
  };

  handleSignOut = (): void => {
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
          this.setState({
            isSignedIn: false
          });
        });
    }
  };

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
                handleSignOut={this.handleSignOut}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
