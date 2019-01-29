import React, { Component } from 'react';
import './Profile.css';
import AvatarModal from '../AvatarModal/AvatarModal';

interface ProfileProps {
    user: any,
    updateProfile: any,
    onRouteChange: any
}

interface ProfileState {
    name: string,
    username: string,
    location: string,
    searches: number,
    avatar: string,
    modal: boolean
}
    

class Profile extends Component <ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props)
        this.state = {
            username: this.props.user.username,
            name: this.props.user.name,
            location: this.props.user.location,
            searches: this.props.user.entries,
            avatar: this.props.user.avatar,
            modal: false
        }
    }

    showModal = () => {
        this.setState({ modal: true });
    };

    hideModal = () => {
        this.setState({ modal: false });
    };

    updateAvatar (avatar:number) {
        const a = avatar.toString()
        this.setState({
            avatar: a,
            modal: false
        })
    }

    onChange (event: any) {
        const key : string = event.target.name;
        const value : string = event.target.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: value // No error here, but can't ensure that key is in StateKeys
        }));
    }

    render () {
        const { avatar, searches, name, username, location } = this.state;
        const avatars = [1,1,1,1,1,1].map((avatar:any, i:number) => {
            return <div key={i} 
                        className={"avatar avatar" + (i + 1)}
                        onClick={() => this.updateAvatar(i+1)} >
                    </div>
        })
        return (
            <div className="profile">
                <div className="profile-container">
                <div className="box1">
                    <div className={"avatar avatar" + avatar}></div>
                        <div className="profile-close" onClick={() => this.props.onRouteChange('home')}>X</div>
                </div>
                <div className="box2">
                    <div className="profile-details">
                        <div className="profile-item">
                            <input name="username" onChange={(event) => {this.onChange(event)}} value={username}></input>
                            <button className="fa fa-edit"></button>
                        </div>
                        <div className="profile-item">
                                <input name="name" onChange={(event) => { this.onChange(event) }} value={name}></input>
                            <button className="fa fa-edit"></button>
                        </div>
                        <div className="profile-item">
                            <input name="location" onChange={(event) => { this.onChange(event) }} value={location}></input>
                            <button className="fa fa-edit"></button>
                        </div>
                        <div className="profile-item">
                            <div>Searches: {searches}</div>
                            
                        </div>
                        <button onClick={this.showModal}>Choose Avatar</button>
                            <AvatarModal show={this.state.modal} handleClose={this.hideModal}>
                                {avatars}
                            </AvatarModal>
                        <button type="submit" onClick={() => this.props.updateProfile(this.state)}>Update Profile</button>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Profile;
