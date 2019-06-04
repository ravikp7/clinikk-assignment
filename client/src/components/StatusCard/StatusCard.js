import React from 'react';
import Button from '../Button/Button';
import './StatusCard.css';

const StatusCard = ({ status, handleSuccess, handleFailure }) => {
  const loadingCard = (
    <div className="loading-card">
      <div className="loading-bubble" />
      <div className="loading-bubble" />
      <div className="loading-bubble" />
      <div className="loading-bubble" />
    </div>
  );

  const getStatusCard = ({ message, handleClick }) => {
    return (
      <div className="modal-overlay">
        <div className="status-card">
          <p className="status-card-message">{message}</p>
          <Button text="OK" style={{ width: '7rem' }} onClick={handleClick} />
        </div>
      </div>
    );
  };

  if (status === 'done') return null;
  if (status === 'loading') {
    return <div className="modal-overlay">{loadingCard}</div>;
  }
  switch (status) {
    case 'done':
      return null;
    case 'loading':
      return <div className="modal-overlay">{loadingCard}</div>;
    case 'error':
      return getStatusCard({
        message: 'Failed. Try again!',
        handleClick: handleFailure,
      });
    default:
      return getStatusCard({
        message: 'Successfully added!',
        handleClick: handleSuccess,
      });
  }
};

export default StatusCard;
