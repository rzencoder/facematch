import React, { Component } from 'react';
import './Navigation.scss';
import face from './face.png';

interface NavProps {
    onRouteChange: any,
    isSignedIn: boolean
}

class Navigation extends Component<NavProps> {
    handleSignOut() {
        const token = window.sessionStorage.getItem('token');
        window.sessionStorage.removeItem('token');
        if (token) {
            fetch('/signout',
                {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token
                    }
                })
                .then(resp => resp.json())
                .then(data => {
                    this.props.onRouteChange('landing');
                })
        }
    }

    render() {
        return (
            <div className="nav-container">
                <div className="logo-container">
                    <div>
                        <img className="logo" src={face} alt='' />
                    </div>
                    <div className="logo-text">Face<span>Match</span></div>
                </div>
                {this.props.isSignedIn ?
                    <nav className="nav">
                        <p onClick={() => this.props.onRouteChange('profile')}>Profile</p>
                        <p onClick={() => this.handleSignOut()}>Sign Out</p>
                    </nav>
                    :
                    <nav className="nav">
                        <p onClick={() => this.props.onRouteChange('signin')}>Sign In</p>
                        <p onClick={() => this.props.onRouteChange('register')}>Register</p>
                    </nav>
                }
            </div>
        )
    }
}

export default Navigation;
