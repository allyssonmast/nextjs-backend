export interface IAvatarService {
  getUserAvatar(userId: number): Promise<any>;
  deleteAvatar(userId: number): Promise<void>;
}
