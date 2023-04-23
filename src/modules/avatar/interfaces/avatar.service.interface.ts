export interface IAvatarService {
  getUserAvatar(userId: number): Promise<string>;
  deleteAvatar(userId: number): Promise<void>;
}
