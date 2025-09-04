import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// VERIFICAR: El nombre de la clase es 'SignupDto' (minúscula)
export class SignupDto {
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}