import React, { Component } from 'react';
import SearchBox from './components/SearchBox/SearchBox';
import StatusCard from './components/StatusCard/StatusCard';
import AddUserModal from './components/AddUserModal/AddUserModal';
import Button from './components/Button/Button';
import UsersTable from './components/UsersTable/UsersTable';
import PageNavigation from './components/PageNavigation/PageNavigation';
import { getUsersCount, getUsersList, searchUser } from './utils/usersApi';
import './App.css';

const initialState = {
  showAddUserModal: false,
  offset: 0,
  limit: 10,
  usersCount: 0,
  usersList: [],
  loadState: 'loading',
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.updateUsersList = this.updateUsersList.bind(this);
    this.handleLoadError = this.handleLoadError.bind(this);
    this.handleFormSubmitState = this.handleFormSubmitState.bind(this);
    this.handleFormSubmitSuccess = this.handleFormSubmitSuccess.bind(this);
  }

  componentDidMount() {
    this.initialiseList();
  }

  async initialiseList() {
    try {
      await this.updateUsersList();
      this.setState({ loadState: 'done' });
    } catch (error) {
      this.setState({ loadState: 'error' });
    }
  }

  async updateUsersList({ offset } = {}) {
    const usersListPromise = getUsersList({
      offset: offset !== undefined ? offset : this.state.offset,
      limit: this.state.limit,
    });
    const totalUsersPromise = getUsersCount();
    const [usersCount, usersList] = await Promise.all([
      totalUsersPromise,
      usersListPromise,
    ]);
    this.setState({
      usersCount,
      usersList,
    });
  }

  handleModalVisibility() {
    this.setState(state => ({ showAddUserModal: !state.showAddUserModal }));
  }

  handleLoadError() {
    this.setState({ loadState: 'done' });
  }

  handleFormSubmitSuccess() {
    this.handleModalVisibility();
    this.handleFormSubmitState({ status: 'done' });
  }

  handleFormSubmitState({ status }) {
    this.setState({ loadState: status });
  }

  async previousPage() {
    try {
      const { offset, limit } = this.state;
      await this.updateUsersList({
        offset: offset - limit,
      });
      this.setState(state => ({ offset: state.offset - state.limit }));
    } catch (error) {
      this.setState({ loadState: 'error' });
    }
  }

  async nextPage() {
    try {
      const { offset, limit } = this.state;
      await this.updateUsersList({
        offset: offset + limit,
      });
      this.setState(state => ({ offset: state.offset + state.limit }));
    } catch (error) {
      this.setState({ loadState: 'error' });
    }
  }

  async handleSearch(phoneNumber) {
    if (phoneNumber === '') {
      this.setState(initialState);
      this.initialiseList();
    } else {
      try {
        this.setState({ loadState: 'loading' });
        const foundUser = await searchUser({ phoneNumber });
        this.setState({
          ...initialState,
          usersList: foundUser,
          loadState: 'done',
        });
      } catch (error) {
        this.setState({ loadState: 'error' });
      }
    }
  }

  render() {
    const showModal = () => {
      if (this.state.showAddUserModal) {
        return (
          <AddUserModal
            handleCloseModal={this.handleModalVisibility}
            updateUsersList={this.updateUsersList}
            handleFormSubmitState={this.handleFormSubmitState}
          />
        );
      }
    };

    return (
      <div className="App">
        {showModal()}
        <StatusCard
          status={this.state.loadState}
          handleFailure={this.handleLoadError}
          handleSuccess={this.handleFormSubmitSuccess}
        />
        <header className="App-header">
          <p className="App-title">Clinikk</p>
        </header>
        <div className="App-body">
          <div className="App-body-top-row">
            <div className="top-row-col-first">
              <SearchBox handleClick={this.handleSearch} />
            </div>
            <div className="top-row-col-second">
              <Button
                text="+ Add User"
                type="large"
                onClick={this.handleModalVisibility}
              />
            </div>
          </div>
          <div className="App-body-users-list">
            <UsersTable usersList={this.state.usersList} />
            <PageNavigation
              offset={this.state.offset}
              limit={this.state.limit}
              usersCount={this.state.usersCount}
              handleNextPage={this.nextPage}
              handlePreviousPage={this.previousPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
