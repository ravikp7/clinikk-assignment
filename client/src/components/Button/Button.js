import React from 'react';
import './Button.css';

const Button = ({ onClick, text, type, ...otherAttributes }) => {
  return (
    <button
      onClick={onClick}
      className={
        type === 'large'
          ? 'large-button styled-button'
          : 'small-button styled-button'
      }
      {...otherAttributes}
    >
      {text}
    </button>
  );
};

export default Button;
