export interface IUserApi {
  findById(userId: number): Promise<any>;
}
