import React from 'react';
import './componentStyles.css';

const CustomCard = ({ title, profile, headline, logo, theme, handleClick }) => {
  return (
    <div className="card" style={{ backgroundImage: `url(${profile})` }}>
      <div className="card-details">
        <p className="text-title">{title}</p>
        <p className="text-body">{headline}</p>
      </div>
      <button className="card-button" style={{ backgroundColor: theme }} onClick={() => handleClick(title)}>
        More info
      </button>
    </div>
  );
};

export default CustomCard;
