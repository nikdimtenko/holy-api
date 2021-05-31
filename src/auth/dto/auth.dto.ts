import { IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  login: string;

  @IsString()
  @Length(6, 256, { message: 'Input minimum 6  symbols' })
  password: string;
}
