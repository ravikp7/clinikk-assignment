import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
});

export default model('User', userSchema);
