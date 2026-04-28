import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: 'El email no es valido' })
  email: string;

  @IsString({ message: 'La contraseña no es valida' })
  @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto.email, LoginDto.password);
  }
}
