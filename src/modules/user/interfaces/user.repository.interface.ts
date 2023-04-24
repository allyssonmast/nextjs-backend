export interface IUserRepository {
  findById(userId: number): Promise<any>;
  findByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<any>;
}
