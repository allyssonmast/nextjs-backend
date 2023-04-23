export interface IUserRepository {
  createUser(user: any): Promise<any>;
  getUserById(userId: number): Promise<any>;
  findByEmail(email: string): Promise<any>;
  saveImage(image: any): Promise<any>;
  findImageById(imageId: string): Promise<any>;
  removeEntryFromDB(imageId: string): Promise<void>;
}
