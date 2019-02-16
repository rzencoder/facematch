import React, { Component } from "react";
import "./Profile.scss";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import AvatarModal from "../Modals/AvatarModal";
import DeleteModal from "../Modals/DeleteModal";

const convertDate = (date: any) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const splitDate = date.split("-");
  return months[Number(splitDate[1]) - 1] + " " + splitDate[0];
};

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
  handleSignOut: any;
  location: any;
  history: any;
}

interface ProfileState {
  name: string;
  username: string;
  city: string;
  avatar: string;
  avatarModal: boolean;
  deleteModal: boolean;
}

class Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      username: this.props.username,
      name: this.props.name,
      city: this.props.city,
      avatar: this.props.avatar,
      avatarModal: false,
      deleteModal: false
    };
  }

  showModal = (modal: string) => {
    this.setState(prevState => ({
      ...prevState,
      [modal]: true // No error here, but can't ensure that key is in StateKeys
    }));
  };

  hideModal = (modal: string) => {
    console.log("hiding");
    this.setState(prevState => ({
      ...prevState,
      [modal]: false // No error here, but can't ensure that key is in StateKeys
    }));
  };

  updateAvatar(avatar: number) {
    this.setState({
      avatar: avatar.toString(),
      avatarModal: false
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

  handleDeleteProfile = () => {
    this.setState(
      {
        deleteModal: false
      },
      () => {
        const token: any = window.sessionStorage.getItem("token");
        fetch(`/delete_profile/${this.props.id}`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            authorization: token
          },
          body: JSON.stringify({ username: this.props.username })
        })
          .then(resp => resp.json())
          .then(data => {
            console.log(data);
            this.props.handleSignOut();
          });
      }
    );
  };

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
              <div className="close-btn">&times;</div>
            </Link>
            <div className="profile-item-username">{username}</div>
          </div>
          <div className="profile-middle">
            <div>{name}</div>
            <div>{city}</div>
            <div>Joined: {convertDate(this.props.joined)}</div>
          </div>
          <div className="profile-bottom">
            <div className="profile-details">
              <h3 className="edit-profile-heading">Edit Profile</h3>
              <div className="profile-item">
                <label htmlFor="name">Name</label>
                <input
                  className="profile-item-name"
                  name="name"
                  onChange={event => {
                    this.onChange(event);
                  }}
                  value={name}
                />
              </div>
              <div className="profile-item">
                <label htmlFor="city">Location</label>
                <input
                  className="profile-item-location"
                  name="city"
                  onChange={event => {
                    this.onChange(event);
                  }}
                  value={city}
                />
              </div>
              <button
                className="btn avatar-btn"
                onClick={() => this.showModal("avatarModal")}
              >
                Choose Avatar
              </button>
              <AvatarModal
                show={this.state.avatarModal}
                handleClose={this.hideModal}
              >
                {avatars}
              </AvatarModal>
              <button
                className="btn update-profile-btn"
                type="submit"
                onClick={() => this.updateProfile(this.state)}
              >
                Save
              </button>
              <button
                className="btn delete-btn"
                onClick={() => {
                  this.showModal("deleteModal");
                }}
              >
                Delete Profile
              </button>
              <DeleteModal
                show={this.state.deleteModal}
                handleClose={this.hideModal}
                handleDeleteProfile={this.handleDeleteProfile}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
