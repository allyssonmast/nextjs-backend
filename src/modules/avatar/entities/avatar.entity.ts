export class AvatarEntity {
  constructor(
    public readonly userId: string,
    public readonly imageData: Buffer,
  ) {}
}
