import React from 'react';
import './Home.css';
import image from './home.png'

const Home = ({ onRouteChange }) => (
    <div>    
        <h1 className="home-title">
          Face<span>Match</span>
        </h1>
        <p className="tagline">Detect faces in your favorite images</p>
        <img className="home-img" alt="logo of five stick figures" src={image}/>
        <div className="home-btn-container">
            <button className="btn" onClick={()=> onRouteChange('signin')}>Sign In</button>
            <button className="btn" onClick={()=> onRouteChange('register')}>Register</button>
        </div>
    </div>
);

export default Home;
