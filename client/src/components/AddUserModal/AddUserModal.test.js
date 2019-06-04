import React from 'react';
import { shallow } from 'enzyme';
import AddUserModal from './AddUserModal';
import Button from '../Button/Button';
import InputBox from '../InputBox/InputBox';
import { addUser } from '../../utils/usersApi';
import isFieldValid from '../../utils/validationCheck';

jest.mock('../../utils/validationCheck');
jest.mock('../../utils/usersApi');

isFieldValid.mockImplementation(() => true);

addUser.mockResolvedValue(null);

const handleCloseModal = jest.fn();
const updateUsersList = jest.fn().mockResolvedValue(null);
const handleFormSubmitState = jest.fn();

describe('<AddUserModal />', () => {
  const wrapper = shallow(
    <AddUserModal
      {...{ updateUsersList, handleFormSubmitState, handleCloseModal }}
    />
  );

  describe('Initial render', () => {
    it('renders without crashing', () => {
      expect(wrapper).not.toBe(null);
    });

    it('should render 5 <InputBox />', () => {
      expect(wrapper.find(InputBox).length).toBe(5);
    });

    it('should render 3 <input /> for gender selection', () => {
      expect(wrapper.find('input').length).toBe(3);
    });

    it('should render 2 <Button /> for Submit and Cancel', () => {
      expect(wrapper.find(Button).length).toBe(2);
    });

    it('should close Modal on Cancel button click', () => {
      wrapper
        .findWhere(node => node.props().text === 'Cancel')
        .simulate('click');
      expect(handleCloseModal).toBeCalled();
    });
  });

  describe('handleInputChange() class method', () => {
    const event = {
      target: {
        name: '',
        value: '',
      },
    };

    const instance = wrapper.instance();

    it('should capitalise first letter and set names', () => {
      event.target.name = 'firstName';
      event.target.value = 'a';
      instance.handleInputChange(event);
      expect(wrapper.state().firstName.value).toBe('A');
      event.target.name = 'lastName';
      event.target.value = 'a';
      instance.handleInputChange(event);
      expect(wrapper.state().lastName.value).toBe('A');
    });

    it('should not allow invalid phone numbers', () => {
      event.target.name = 'phoneNumber';
      const validPhoneNumber = '8447553091';
      event.target.value = validPhoneNumber;
      instance.handleInputChange(event);
      expect(wrapper.state().phoneNumber.value).toBe(validPhoneNumber);
      event.target.value = 'trastar'; // Invalid
      instance.handleInputChange(event);
      expect(wrapper.state().phoneNumber.value).toBe(validPhoneNumber);
      event.target.value = '84475329215'; // Invalid
      instance.handleInputChange(event);
      expect(wrapper.state().phoneNumber.value).toBe(validPhoneNumber);
    });

    it('should validate input with isFieldValid()', () => {
      event.target.name = 'email';
      event.target.value = '7ravikp@gmail.com';
      instance.handleInputChange(event);
      const { name, value } = event.target;
      expect(isFieldValid).toBeCalledWith({ name, value });
    });
  });

  describe('handleFormSubmit() class method', () => {
    const instance = wrapper.instance();
    let spy;
    beforeAll(() => {
      const event = {
        preventDefault: jest.fn(),
      };
      spy = jest.spyOn(instance, 'isFormValid').mockImplementation(() => true);
      instance.handleFormSubmit(event);
    });

    it('should check form validity', () => {
      expect(spy).toBeCalled();
    });

    it('should make addUser() api call', () => {
      const state = wrapper.state();
      expect(addUser).toBeCalledWith({
        firstName: state.firstName.value,
        lastName: state.lastName.value,
        email: state.email.value,
        dateOfBirth: state.dateOfBirth.value,
        phoneNumber: state.phoneNumber.value,
        gender: state.gender.value,
      });
    });

    it('should update form submit state', () => {
      expect(handleFormSubmitState).toBeCalledWith({ status: 'loading' });
      expect(handleFormSubmitState).toBeCalledWith({ status: 'success' });
    });

    it('should update Users list', () => {
      expect(updateUsersList).toBeCalled();
    });

    afterAll(() => {
      spy.mockRestore();
    });
  });

  describe('isFormValid() class method', () => {
    it('should return true for a valid form', () => {
      expect(wrapper.instance().isFormValid()).toBe(true);
    });

    it('should return false for an invalid form', () => {
      const instance = wrapper.instance();
      instance.setState({
        phoneNumber: {
          value: '',
          isValid: false,
        },
      });
      expect(instance.isFormValid()).toBe(false);
    });
  });
});
