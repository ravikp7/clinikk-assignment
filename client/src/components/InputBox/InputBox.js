import React, { Fragment } from 'react';
import './InputBox.css';

const InputBox = ({
  name,
  type,
  showLabel,
  label,
  placeholder,
  onChangeHandle,
  required,
  isValid,
  ...otherAttributes
}) => {
  return (
    <Fragment>
      <label htmlFor={name} hidden={!showLabel}>
        {label}
      </label>
      <input
        className={
          isValid ? 'styled-input valid-input' : 'styled-input invalid-input'
        }
        type={type || 'text'}
        placeholder={required ? `${placeholder} (Required)` : placeholder}
        name={name}
        onChange={onChangeHandle}
        required={required}
        {...otherAttributes}
      />
    </Fragment>
  );
};

export default InputBox;
