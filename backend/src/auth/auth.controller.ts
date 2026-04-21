import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
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
