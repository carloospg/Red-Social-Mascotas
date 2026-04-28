import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    nombre: string

    @IsEmail({}, { message: 'El email no es válido' })
    email: string

    @IsString({ message: 'La contraseña no es valida' })
    @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
    password: string
}