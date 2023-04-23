export interface IUserRepository {
  getUserById(userId: number): Promise<any>;
  findByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<any>;
}
