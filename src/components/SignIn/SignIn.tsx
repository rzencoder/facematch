import React from "react";
import "./SignIn.scss";
import { Redirect } from "react-router";

interface Props {
  loadUser: any;
  match: any;
  location: any;
  isSignedIn: boolean;
}

interface State {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  error: string;
  redirectToReferrer: boolean;
}

class SignIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      error: "",
      redirectToReferrer: false
    };
  }

  onNameChange = (event: any) => {
    this.setState({ name: event.target.value });
  };

  onUsernameChange = (event: any) => {
    this.setState({ username: event.target.value });
  };

  onPasswordChange = (event: any) => {
    this.setState({ password: event.target.value });
  };

  onConfirmPasswordChange = (event: any) => {
    this.setState({ confirmPassword: event.target.value });
  };

  saveAuthToken = (token: string) => {
    window.sessionStorage.setItem("token", token);
  };

  passwordValidation() {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    return re.test(this.state.password);
  }

  onSubmit = () => {
    if (this.props.match.path === "/register") {
      const { password, confirmPassword } = this.state;
      if (password !== confirmPassword) {
        return this.setState({
          error: "Passwords must match"
        });
      }
      if (!this.passwordValidation()) {
        return this.setState({
          error:
            "Password must be at least 6 characters, Contain an upper and lower case character"
        });
      }
    }
    this.sendInputData();
  };

  sendInputData() {
    const url: string = this.props.match.path;
    fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        name: this.state.name
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.saveAuthToken(data.token);
        if (data && data.id) {
          fetch(`/profile/${data.id}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              authorization: data.token
            }
          })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.username) {
                console.log(user);

                this.setState({
                  redirectToReferrer: true
                });
                this.props.loadUser(user);
              }
            });
        } else {
          console.log(data);
          // this.setState({
          //   error: data
          // });
        }
      });
  }

  render() {
    const title: string =
      this.props.match.path === "/signin" ? "SIGN IN" : "REGISTER";
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;
    const { isSignedIn } = this.props;
    if (redirectToReferrer || isSignedIn) {
      console.log("ok");
      return <Redirect to={from} />;
    }
    return (
      <div className="form-container">
        <div className="form">
          <h3 className="form-title">{title}</h3>
          <div className="form-input-container">
            {this.state.error ? (
              <div className="error-message">{this.state.error}</div>
            ) : (
              ""
            )}
            {title === "REGISTER" ? (
              <div className="input-container">
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.onNameChange}
                  type="text"
                  name="name"
                  id="name"
                  required
                />
              </div>
            ) : (
              ""
            )}
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <input
                onChange={this.onUsernameChange}
                type="text"
                name="username"
                id="username"
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                onChange={this.onPasswordChange}
                type="password"
                name="password"
                id="password"
                required
              />
            </div>
            {title === "REGISTER" ? (
              <div className="input-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  onChange={this.onConfirmPasswordChange}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <input
              className="submit-btn"
              onClick={this.onSubmit}
              type="submit"
              value={title}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
