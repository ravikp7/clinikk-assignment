import {
  insertUser, queryUsers, queryUserByPhone, queryUsersCount,
} from '../utils/db_query';
import httpStatuses from '../utils/constants';

const {
  HTTP_SUCCESS_OK, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND,
} = httpStatuses;

const getUsers = async (req, res) => {
  try {
    const { offset, limit } = req.query;
    const users = await queryUsers({ offset: parseInt(offset, 10), limit: parseInt(limit, 10) });
    res.status(HTTP_SUCCESS_OK).json({
      users,
    });
  } catch (error) {
    res.status(HTTP_NOT_FOUND);
  }
};

const createUser = async (req, res) => {
  try {
    const {
      firstName, lastName, dateOfBirth, gender, phoneNumber, email,
    } = req.body;
    await insertUser({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
    });
    res.status(HTTP_CREATED).json({
      userCreated: firstName,
    });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR);
  }
};

const getUsersByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    const user = await queryUserByPhone(phoneNumber);
    res.status(HTTP_SUCCESS_OK).json(user);
  } catch (error) {
    res.status(HTTP_NOT_FOUND);
  }
};

const getUsersCount = async (req, res) => {
  try {
    const usersCount = await queryUsersCount();
    res.status(HTTP_SUCCESS_OK).json(usersCount);
  } catch (error) {
    res.status(HTTP_NOT_FOUND);
  }
};

export {
  getUsers, getUsersByPhone, createUser, getUsersCount,
};
