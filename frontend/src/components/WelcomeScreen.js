import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onJoin }) => {
  return (
    <div className="whole-page-container">
      <h1 className="title">Ideaa</h1>
      <button className="join-button" onClick={onJoin}>
        Присоединиться
      </button>
    </div>
  );
};

export default WelcomeScreen;
