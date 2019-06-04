import User from '../models/user.model';

const insertUser = ({
  firstName, lastName, dateOfBirth, gender, phoneNumber, email,
}) => {
  const user = new User({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
  });
  return user.save();
};

const queryUsers = ({ offset, limit }) => User.find()
  .skip(offset)
  .limit(limit);

const queryUserByPhone = phoneNumber => User.find().where({ phoneNumber });

const queryUsersCount = () => User.countDocuments();

export {
  insertUser, queryUsers, queryUserByPhone, queryUsersCount,
};
