import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// VERIFICAR: El nombre de la clase es 'SigninDto' (minúscula)
export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}