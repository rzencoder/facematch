import React, { Component } from 'react';
import './Profile.scss';
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
    private textInput: React.RefObject<HTMLInputElement>;
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
        this.textInput = React.createRef();
        
        
    }

    setTextInputRef = (element:any) => {
    this.textInput = element;
    console.log(element)
    console.log(this.textInput)
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
                        <div className="fa fa-times profile-close" onClick={() => this.props.onRouteChange('home')}></div>
                </div>
                <div className="box2">
                    <div className="profile-details">
                        <div className="profile-item">
                                <input className="profile-item-username" name="username" ref={this.setTextInputRef} onChange={(event) => {this.onChange(event)}} value={username}></input>
                                <div onClick={this.focusTextInput} className="fa fa-edit"></div>
                        </div>
                        <div className="profile-item">
                                <input className="profile-item-name" name="name" ref={this.setTextInputRef} onChange={(event) => { this.onChange(event) }} value={name}></input>
                                <div onClick={this.focusTextInput} className="fa fa-edit"></div>
                        </div>
                        <div className="profile-item">
                                <input className="profile-item-location" name="location" ref={this.setTextInputRef} onChange={(event) => { this.onChange(event) }} value={location}></input>
                                <div onClick={this.focusTextInput} className="fa fa-edit"></div>
                        </div>
                        <div className="profile-item">
                            <div>Searches: {searches}</div>
                            
                        </div>
                        <button className="btn avatar-btn" onClick={this.showModal}>Choose Avatar</button>
                            <AvatarModal show={this.state.modal} handleClose={this.hideModal}>
                                {avatars}
                            </AvatarModal>
                        <button className="btn update-profile-btn" type="submit" onClick={() => this.props.updateProfile(this.state)}>Save</button>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Profile;
