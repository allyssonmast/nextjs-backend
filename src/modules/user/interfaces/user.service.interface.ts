export interface IUserService {
  getUserById(userId: number): Promise<any>;
  createUser(user: any): Promise<any>;
}
