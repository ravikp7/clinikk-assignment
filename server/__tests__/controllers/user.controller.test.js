import {
  getUsers,
  getUsersByPhone,
  createUser,
  getUsersCount,
} from '../../src/controllers/user.controller';

import {
  insertUser,
  queryUsers,
  queryUserByPhone,
  queryUsersCount,
} from '../../src/utils/db_query';
import httpStatuses from '../../src/utils/constants';

const {
  HTTP_SUCCESS_OK, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND,
} = httpStatuses;

jest.mock('../../src/utils/db_query');

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
const error = new Error('Query failed');

insertUser.mockImplementation(async ({ firstName }) => {
  if (firstName) {
    return sampleUsers[0];
  }
  throw error;
});

queryUsers.mockImplementation(async ({ offset, limit }) => {
  if (offset && limit) {
    return sampleUsers;
  }
  throw error;
});

queryUserByPhone.mockImplementation(async (phoneNumber) => {
  if (phoneNumber) {
    return sampleUsers;
  }
  throw error;
});

queryUsersCount.mockImplementation(async () => sampleUsers.length);

describe('Users API controllers', () => {
  const req = {
    query: {
      offset: 1,
      limit: 10,
      phoneNumber: sampleUsers[0].phoneNumber,
    },
    body: sampleUsers[0],
  };
  const res = {
    responseStatus: '',
    jsonData: '',
    status(statusCode) {
      this.responseStatus = statusCode;
      const json = (data) => {
        this.jsonData = data;
      };
      return { json };
    },
  };

  describe('getUsers GET controller', () => {
    describe('SUCCESS', () => {
      beforeAll(() => {
        getUsers(req, res);
      });

      it('should query users count from DB', () => {
        expect(queryUsers).toBeCalled();
      });

      it('should query users from DB with offset and limit', () => {
        const offset = parseInt(req.query.offset, 10);
        const limit = parseInt(req.query.limit, 10);
        expect(queryUsers).toBeCalledWith({ offset, limit });
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send users in response on success', () => {
        expect(res.jsonData.users).toEqual(sampleUsers);
      });
    });
    describe('FAILURE', () => {
      beforeAll(() => {
        req.query.offset = null; // To create error
        getUsers(req, res);
      });

      afterAll(() => {
        req.query.offset = 1;
      });

      it('should set HTTP NOT FOUND ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_NOT_FOUND);
      });
    });
  });

  describe('getUsersByPhone GET controller', () => {
    describe('SUCCESS', () => {
      beforeAll(() => {
        getUsersByPhone(req, res);
      });

      it('should query DB', () => {
        expect(queryUserByPhone).toBeCalled();
      });

      it('should query users from DB with Phone Number', () => {
        const { phoneNumber } = req.query;
        expect(queryUserByPhone).toBeCalledWith(phoneNumber);
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send users in response on success', () => {
        expect(res.jsonData).toEqual(sampleUsers);
      });
    });
    describe('FAILURE', () => {
      beforeAll(() => {
        req.query.phoneNumber = null; // To create error
        getUsersByPhone(req, res);
      });

      afterAll(() => {
        req.query.phoneNumber = sampleUsers[0].phoneNumber;
      });

      it('should set HTTP NOT FOUND ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_NOT_FOUND);
      });
    });
  });

  describe('getUsersCount GET controller', () => {
    describe('SUCCESS', () => {
      beforeAll(() => {
        getUsersCount(req, res);
      });

      it('should query user count from DB', () => {
        expect(queryUsersCount).toBeCalled();
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send users in response on success', () => {
        expect(res.jsonData).toEqual(sampleUsers.length);
      });
    });
  });

  describe('createUser POST controller', () => {
    describe('SUCCESS', () => {
      beforeAll(() => {
        createUser(req, res);
      });

      it('should query DB', () => {
        expect(insertUser).toBeCalled();
      });

      it('should query DB with User details', () => {
        expect(insertUser).toBeCalledWith(sampleUsers[0]);
      });

      it('should set HTTP STATUS CREATED on success', () => {
        expect(res.responseStatus).toEqual(HTTP_CREATED);
      });

      it('should send user first name in response on success', () => {
        expect(res.jsonData.userCreated).toEqual(sampleUsers[0].firstName);
      });
    });
    describe('FAILURE', () => {
      beforeAll(() => {
        req.body = { ...sampleUsers[0], firstName: null }; // To create error
        createUser(req, res);
      });

      afterAll(() => {
        [req.body] = sampleUsers;
      });

      it('should set HTTP SERVER ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_INTERNAL_SERVER_ERROR);
      });
    });
  });
});
