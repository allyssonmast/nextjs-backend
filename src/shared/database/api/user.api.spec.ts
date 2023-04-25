import axios from 'axios';

import MockAdapter from 'axios-mock-adapter';
import { IUserApi } from 'src/shared/database/api/user-api.interface';

import { UserApi } from './user.api';

describe('UserApi', () => {
  let userApi: IUserApi;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    userApi = new UserApi();
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('should fetch user by id', async () => {
    const userId = 1;
    const userData = { id: userId, name: 'John' };
    axiosMock
      .onGet(`https://reqres.in/api/users/${userId}`)
      .reply(200, { data: userData });

    const result = await userApi.findById(userId);

    expect(result).toEqual(userData);
  });

  it('should handle error when fetching user by id', async () => {
    const userId = 1;
    axiosMock.onGet(`https://reqres.in/api/users/${userId}`).reply(500, {});

    await expect(userApi.findById(userId)).rejects.toThrowError('Not Found');
  });
});
