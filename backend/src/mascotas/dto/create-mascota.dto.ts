import { Type } from "class-transformer";
import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateMascotaDto {
    @IsString()
    nombre: string;

    @IsString()
    especie: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    edad: number;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    urlFoto: string;
}