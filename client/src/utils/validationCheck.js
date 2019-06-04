const isFieldValid = ({ name, value }) => {
  switch (name) {
    case 'firstName':
      return value !== '';
    case 'gender':
      return value !== '';
    case 'dateOfBirth':
      return value !== '';
    case 'email':
      return (
        value === '' ||
        RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(value)
      );
    case 'phoneNumber':
      return RegExp(/^[6-9]\d{9}$/).test(value);
    default:
      return true;
  }
};

export default isFieldValid;
