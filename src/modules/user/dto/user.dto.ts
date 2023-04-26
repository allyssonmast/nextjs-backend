import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsUrl,
  Matches,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi, {
    message: 'Avatar must be a valid URL pointing to an image.',
  })
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z]+$/, { message: 'First name should contain only letters' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z]+$/, { message: 'Last name should contain only letters' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
