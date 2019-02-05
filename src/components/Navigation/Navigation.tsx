import React from 'react';
import './Navigation.scss';
import face from './face.png';

interface NavProps {
    onRouteChange: any,
    isSignedIn: boolean
}

const Navigation = ({ onRouteChange, isSignedIn }: NavProps) => (
    <div className="nav-container">
        <div className="logo-container">
            <div>
                <img className="logo" src={face} alt=''/>
            </div>
            <div className="logo-text">Face<span>Match</span></div>
        </div>
        { isSignedIn ? 
        <nav className="nav">
            <p onClick={() => onRouteChange('profile')}>Profile</p>
            <p onClick={() => onRouteChange('landing')}>Sign Out</p>
        </nav>
        : 
        <nav className="nav">
            <p onClick={() => onRouteChange('signin')}>Sign In</p>
            <p onClick={() => onRouteChange('register')}>Register</p>
        </nav>        
        }
    </div>
);

export default Navigation;
