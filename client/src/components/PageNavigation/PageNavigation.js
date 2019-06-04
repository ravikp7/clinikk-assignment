import React from 'react';
import Button from '../Button/Button';

const PageNavigation = ({
  offset,
  limit,
  usersCount,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <div className="users-list-navigation">
      <p style={{ color: 'white', margin: '1rem' }}>
        Pages {parseInt(offset / limit) + 1} / {Math.ceil(usersCount / limit)}
      </p>
      <Button
        text="Previous"
        style={{ width: '6rem', margin: '0 1rem' }}
        disabled={offset === 0}
        onClick={handlePreviousPage}
      />
      <Button
        text="Next"
        style={{ width: '6rem', margin: '0 1rem' }}
        disabled={(offset + 1) * limit >= usersCount}
        onClick={handleNextPage}
      />
    </div>
  );
};

export default PageNavigation;
