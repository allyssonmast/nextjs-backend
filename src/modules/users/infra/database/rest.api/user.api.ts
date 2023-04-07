import { NotFoundException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

export class UserApi {
  readonly baseUrl = 'https://reqres.in/api';
  async findById(userId: number): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseUrl}/users/${userId}`,
      );
      return response.data.data;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
