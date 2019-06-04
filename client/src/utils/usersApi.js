import { get, post } from './api';

const usersRoute = '/api/users/';

const getUsersList = async ({ offset, limit }) => {
  const { data } = await get(`${usersRoute}listUsers`, {
    offset,
    limit,
  });
  return data.users;
};

const getUsersCount = async () => {
  const { data } = await get(`${usersRoute}count`);
  return data;
};

const searchUser = async ({ phoneNumber }) => {
  const { data } = await get(`${usersRoute}search`, { phoneNumber });
  return data;
};

const addUser = ({
  firstName,
  lastName,
  dateOfBirth,
  gender,
  phoneNumber,
  email,
}) =>
  post(`${usersRoute}new`, {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
  });

export { getUsersList, getUsersCount, searchUser, addUser };
