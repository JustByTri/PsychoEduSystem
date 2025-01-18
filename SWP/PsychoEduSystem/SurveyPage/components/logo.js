import React from 'react';
import logo from '../assets/logo.svg';
import './logo.css';

const Logo = () => {
  return (
    <div className="logo-container" data-testid="logo-container">
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default Logo;