import { IsString, IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class UpdateMascotaDto {

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  especie?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  edad?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  urlFoto?: string;
}