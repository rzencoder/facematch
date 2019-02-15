import React, { Component } from "react";
import "./Profile.scss";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import AvatarModal from "../AvatarModal/AvatarModal";

interface ProfileProps {
  name: string;
  username: string;
  id: number;
  joined: any;
  entries: number;
  city: string;
  avatar: string;
  loadUser: any;
  isSignedIn: boolean;
  location: any;
  history: any;
}

interface ProfileState {
  name: string;
  username: string;
  city: string;
  avatar: string;
  modal: boolean;
}

class Profile extends Component<ProfileProps, ProfileState> {
  private textInput: React.RefObject<HTMLInputElement>;
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      username: this.props.username,
      name: this.props.name,
      city: this.props.city,
      avatar: this.props.avatar,
      modal: false
    };
    this.textInput = React.createRef();
  }

  setTextInputRef = (element: any) => {
    this.textInput = element;
    console.log(element);
    console.log(this.textInput);
  };

  focusTextInput = () => {
    // Focus the text input using the raw DOM API
    if (this.textInput) this.textInput;
  };

  showModal = () => {
    this.setState({ modal: true });
  };

  hideModal = () => {
    this.setState({ modal: false });
  };

  updateAvatar(avatar: number) {
    const a = avatar.toString();
    this.setState({
      avatar: a,
      modal: false
    });
  }

  updateProfile = (data: any) => {
    const token: any = window.sessionStorage.getItem("token");
    fetch(`/profile/${this.props.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({ formInput: data })
    })
      .then(resp => resp.json())
      .then(user => {
        if (user && user.username) {
          console.log(user);
          this.props.loadUser(user);
          this.props.history.push("/");
        }
      });
  };

  onChange(event: any) {
    const key: string = event.target.name;
    const value: string = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      [key]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  render() {
    const { avatar, name, username, city } = this.state;
    const avatars = [1, 1, 1, 1, 1, 1].map((avatar: any, i: number) => {
      return (
        <div
          key={i}
          className={"avatar avatar" + (i + 1)}
          onClick={() => this.updateAvatar(i + 1)}
        />
      );
    });
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    if (!this.props.isSignedIn) {
      return <Redirect to={from} />;
    }
    return (
      <div className="profile">
        <div className="profile-container">
          <div className="profile-top">
            <div className={"avatar avatar" + avatar} />
            <Link to="/">
              <div className="fa fa-times profile-close" />
            </Link>
          </div>
          <div className="profile-bottom">
            <div className="profile-details">
              <div className="profile-item">
                <input
                  className="profile-item-username"
                  name="username"
                  ref={this.setTextInputRef}
                  onChange={event => {
                    this.onChange(event);
                  }}
                  value={username}
                />
                <div onClick={this.focusTextInput} className="fa fa-edit" />
              </div>
              <div className="profile-item">
                <input
                  className="profile-item-name"
                  name="name"
                  ref={this.setTextInputRef}
                  onChange={event => {
                    this.onChange(event);
                  }}
                  value={name}
                />
                <div onClick={this.focusTextInput} className="fa fa-edit" />
              </div>
              <div className="profile-item">
                <input
                  className="profile-item-location"
                  name="location"
                  placeholder="Add Location"
                  ref={this.setTextInputRef}
                  onChange={event => {
                    this.onChange(event);
                  }}
                  value={city}
                />
                <div onClick={this.focusTextInput} className="fa fa-edit" />
              </div>
              <div className="profile-item">
                <div>Searches: {this.props.entries}</div>
              </div>
              <button className="btn avatar-btn" onClick={this.showModal}>
                Choose Avatar
              </button>
              <AvatarModal show={this.state.modal} handleClose={this.hideModal}>
                {avatars}
              </AvatarModal>
              <button
                className="btn update-profile-btn"
                type="submit"
                onClick={() => this.updateProfile(this.state)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
