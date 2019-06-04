import React from 'react';
import './UsersTable.css';

const UsersTable = ({ usersList }) => {
  const tableHeadings = [
    'Name',
    'Date of Birth',
    'Gender',
    'Phone Number',
    'Email',
  ];
  return (
    <table id="Users-table">
      <thead>
        <tr id="Table-head-row">
          {tableHeadings.map(heading => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {usersList.map(user => {
          return (
            <tr className="Table-body-row" key={user['_id']}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.dateOfBirth.substring(0, 10)}</td>
              <td>{user.gender}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.email}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default UsersTable;
