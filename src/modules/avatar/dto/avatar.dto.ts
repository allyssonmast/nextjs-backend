import { IsString, IsNotEmpty } from 'class-validator';

export class AvatarDto {
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  readonly imageData: Buffer;
}
