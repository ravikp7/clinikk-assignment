import React, { Component } from 'react';
import Button from '../Button/Button';
import InputBox from '../InputBox/InputBox';
import { addUser } from '../../utils/usersApi';
import isFieldValid from '../../utils/validationCheck';
import './AddUserModal.css';

class AddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: {
        value: '',
        isValid: true,
      },
      lastName: {
        value: '',
        isValid: true,
      },
      phoneNumber: {
        value: '',
        isValid: true,
      },
      email: {
        value: '',
        isValid: true,
      },
      dateOfBirth: {
        value: '',
        isValid: true,
      },
      gender: {
        value: '',
        isValid: true,
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleInputChange(event) {
    let { name, value } = event.target;

    // Capitalise first character
    if (name === 'firstName' || name === 'lastName') {
      if (value.length === 1) {
        value = value.toUpperCase();
      }
    }

    // Restrict phone number input
    if (
      (name === 'phoneNumber' && value.length === 11) ||
      (name === 'phoneNumber' && isNaN(value))
    ) {
      value = this.state[name].value;
    }

    this.setState(state => ({
      [name]: { value, isValid: isFieldValid({ name, value }) },
    }));
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    try {
      if (this.isFormValid()) {
        this.props.handleFormSubmitState({ status: 'loading' });
        await addUser({
          firstName: this.state.firstName.value,
          lastName: this.state.lastName.value,
          email: this.state.email.value,
          dateOfBirth: this.state.dateOfBirth.value,
          phoneNumber: this.state.phoneNumber.value,
          gender: this.state.gender.value,
        });
        this.props.handleFormSubmitState({ status: 'success' });

        await this.props.updateUsersList();
      }
    } catch (error) {
      this.props.handleFormSubmitState({ status: 'error' });
    }
  }

  isFormValid() {
    return Object.keys(this.state).every(key => this.state[key].isValid);
  }

  render() {
    const { handleCloseModal } = this.props;
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <form className="modal-body" onSubmit={this.handleFormSubmit}>
            <div className="modal-header">Hey there!</div>
            <InputBox
              name="firstName"
              label="First Name"
              placeholder="First Name"
              onChangeHandle={this.handleInputChange}
              required
              value={this.state.firstName.value}
              isValid={this.state.firstName.isValid}
              onClick={this.handleInputChange}
            />
            <InputBox
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              onChangeHandle={this.handleInputChange}
              value={this.state.lastName.value}
              isValid={this.state.lastName.isValid}
              onClick={this.handleInputChange}
            />
            <InputBox
              name="phoneNumber"
              label="Phone Number"
              placeholder="10 Digit Phone Number"
              onChangeHandle={this.handleInputChange}
              required
              value={this.state.phoneNumber.value}
              isValid={this.state.phoneNumber.isValid}
              onClick={this.handleInputChange}
            />
            <InputBox
              name="email"
              type="email"
              label="Email"
              placeholder="Email"
              onChangeHandle={this.handleInputChange}
              value={this.state.email.value}
              isValid={this.state.email.isValid}
              onClick={this.handleInputChange}
            />
            <span>
              <InputBox
                required
                name="dateOfBirth"
                showLabel
                label="Date of Birth *"
                type="date"
                max={new Date().toISOString().substring(0, 10)}
                onChangeHandle={this.handleInputChange}
                value={this.state.dateOfBirth.value}
                isValid={this.state.dateOfBirth.isValid}
                onClick={this.handleInputChange}
              />
            </span>
            <div>
              Gender *
              <input
                type="radio"
                checked={this.state.gender.value === 'Male'}
                required
                name="gender"
                onChange={this.handleInputChange}
                value="Male"
              />{' '}
              Male
              <input
                type="radio"
                checked={this.state.gender.value === 'Female'}
                required
                name="gender"
                onChange={this.handleInputChange}
                value="Female"
              />{' '}
              Female
              <input
                type="radio"
                checked={this.state.gender.value === 'Other'}
                required
                name="gender"
                onChange={this.handleInputChange}
                value="Other"
              />{' '}
              Other
            </div>

            <div className="modal-footer">
              <Button text="Submit" type="small" style={{ margin: '0 1rem' }} />
              <Button
                text="Cancel"
                type="small"
                onClick={handleCloseModal}
                style={{ margin: '0 1rem' }}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddUserModal;
