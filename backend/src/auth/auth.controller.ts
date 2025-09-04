import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
// CORRECCIÓN: Importamos los DTOs desde el archivo de índice para más limpieza.
import { SignupDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  // Usamos el nombre estandarizado 'SignupDto'
  signup(@Body() dto: SignupDto) {
    // Usamos el nombre estandarizado 'signup'
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  // Usamos el nombre estandarizado 'SigninDto'
  signin(@Body() dto: SigninDto) {
    // Usamos el nombre estandarizado 'signin'
    return this.authService.signin(dto);
  }
}