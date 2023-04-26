import { NotFoundException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { IUserApi } from 'src/shared/database/api/user-api.interface';

export class UserApi implements IUserApi {
  readonly baseUrl = 'https://reqres.in/api';
  async findById(userId: number): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseUrl}/users/${userId}`
      );
      return response.data.data;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
