import React, { Component } from 'react';
import Button from '../Button/Button';
import InputBox from '../InputBox/InputBox';
import isFieldValid from '../../utils/validationCheck';
import './SearchBox.css';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      isValid: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    // Restrict phone number input
    if (!(value.length === 11 || isNaN(value))) {
      this.setState(() => ({ searchValue: value }));
    }

    this.setState(state => ({
      isValid: value === '' || isFieldValid({ name, value: state.searchValue }),
    }));
  }

  render() {
    return (
      <div id="Search-container">
        <InputBox
          name="phoneNumber"
          label="Search Phone Number"
          onChangeHandle={this.handleChange}
          onFocus={this.handleChange}
          placeholder="10 Digit Phone Number"
          value={this.state.searchValue}
          isValid={this.state.isValid}
        />
        <Button
          text="SEARCH"
          type="small"
          style={{ marginLeft: '1rem' }}
          onClick={() => this.props.handleClick(this.state.searchValue)}
        />
      </div>
    );
  }
}

export default SearchBox;
