import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
