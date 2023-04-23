export interface IAvatarRepository {
  getUserById(userId: number): Promise<any>;
  saveImage(image: any): Promise<any>;
  findImageById(imageId: string): Promise<any>;
  removeEntryFromDB(imageId: string): Promise<void>;
}
