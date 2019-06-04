import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import AddUserModal from './components/AddUserModal/AddUserModal';
import SearchBox from './components/SearchBox/SearchBox';
import Button from './components/Button/Button';
import UsersTable from './components/UsersTable/UsersTable';
import PageNavigation from './components/PageNavigation/PageNavigation';
import { getUsersCount, getUsersList, searchUser } from '../src/utils/usersApi';

jest.mock('../src/utils/usersApi');

const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Mayer',
    dateOfBirth: '1985-10-02',
    gender: 'Male',
    phoneNumber: '9456215475',
    email: 'john@mayer.com',
  },
];

const error = new Error('Network error');

getUsersCount.mockImplementation(async () => sampleUsers.length);

getUsersList.mockImplementation(async ({ offset, limit }) => {
  if (offset !== undefined && limit) {
    return sampleUsers;
  }
  throw error;
});

searchUser.mockImplementation(async ({ phoneNumber }) => {
  if (phoneNumber) {
    return sampleUsers[0];
  }
  throw error;
});

describe('<App />', () => {
  const wrapper = shallow(<App />);

  describe('Initial load', () => {
    it('renders without crashing', () => {
      expect(wrapper).not.toBe(null);
    });

    it('should not render <AddUserModal />', () => {
      expect(wrapper.find(AddUserModal).length).toBe(0);
    });

    it('should render <SearchBox />', () => {
      expect(wrapper.find(SearchBox).length).toBe(1);
    });

    it('should render Add user <Button />', () => {
      expect(wrapper.find(Button).length).toBe(1);
      expect(wrapper.find(Button).props().text).toBe('+ Add User');
    });

    it('should render <UsersTable />', () => {
      expect(wrapper.find(UsersTable).length).toBe(1);
    });

    it('should render <PageNavigation />', () => {
      expect(wrapper.find(PageNavigation).length).toBe(1);
    });
  });

  describe('Add User Modal interaction', () => {
    it('should render Modal on click', () => {
      wrapper
        .findWhere(node => node.props().text === '+ Add User')
        .simulate('click');
      expect(wrapper.find(AddUserModal).length).toBe(1);
    });

    it('should close Modal on click', () => {
      wrapper.instance().handleModalVisibility();
      expect(wrapper.find(AddUserModal).length).toBe(0);
    });
  });

  describe('updateUsersList() class method', () => {
    it('should update Users list', async () => {
      expect(wrapper.state().usersList.length).toBe(sampleUsers.length); // On Mount
      wrapper.setState({ usersList: [] }); // Clear usesrList
      await wrapper.instance().updateUsersList();
      expect(wrapper.state().usersList.length).toBe(sampleUsers.length);
    });

    it('should update Users count', async () => {
      expect(wrapper.state().usersCount).toBe(sampleUsers.length);
      wrapper.setState({ usersCount: 0 });
      await wrapper.instance().updateUsersList();
      expect(wrapper.state().usersCount).toBe(sampleUsers.length);
    });
  });

  describe('previousPage() class method', () => {
    beforeAll(() => {
      const { limit } = wrapper.state();
      wrapper.setState({ offset: 2 * limit });
    });

    it('should decrease offset', async () => {
      const { limit } = wrapper.state();
      await wrapper.instance().previousPage();
      expect(wrapper.state().offset).toBe(limit);
    });

    it('should call updateUsersList()', async () => {
      const instance = wrapper.instance();
      jest.spyOn(instance, 'updateUsersList').mockImplementation(jest.fn());
      const { offset, limit } = wrapper.state();
      await instance.previousPage();
      expect(instance.updateUsersList).toHaveBeenCalledWith({
        offset: offset - limit,
      });
    });

    afterAll(() => {
      wrapper.setState({ offset: 0 });
    });
  });

  describe('nextPage() class method', () => {
    beforeAll(() => {
      wrapper.setState({ offset: 0 });
    });

    it('should increase offset', async () => {
      const { limit } = wrapper.state();
      await wrapper.instance().nextPage();
      expect(wrapper.state().offset).toBe(limit);
    });

    it('should call updateUsersList()', async () => {
      const instance = wrapper.instance();
      jest.spyOn(instance, 'updateUsersList').mockImplementation(jest.fn());
      const { offset, limit } = wrapper.state();
      await instance.nextPage();
      expect(instance.updateUsersList).toHaveBeenCalledWith({
        offset: offset + limit,
      });
    });

    afterAll(() => {
      wrapper.setState({ offset: 0 });
    });
  });

  describe('handleSearch() class method', () => {
    describe('when Phone number is not empty', () => {
      beforeAll(() => {
        wrapper.setState({ usersList: [] });
        wrapper.instance().handleSearch(sampleUsers[0].phoneNumber);
      });

      it('should update Users list', () => {
        expect(wrapper.state().usersList).toBe(sampleUsers[0]);
      });

      it('should call searchUser() with phone number', () => {
        expect(searchUser).toHaveBeenCalledWith({
          phoneNumber: sampleUsers[0].phoneNumber,
        });
      });
    });

    describe('when Phone number is empty string', () => {
      beforeAll(() => {
        wrapper.setState({ usersList: [] });
      });

      it('should set initial state', () => {
        wrapper.instance().handleSearch('');
        expect(wrapper.state().loadState).toBe('loading');
      });

      it('should call initialiseList() method', async () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'initialiseList').mockImplementation(jest.fn());
        await instance.handleSearch('');
        expect(instance.initialiseList).toBeCalled();
      });
    });
  });
});
