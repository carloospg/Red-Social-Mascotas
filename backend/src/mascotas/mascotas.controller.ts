import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { MascotasService } from "./mascotas.service";
import { CreateMascotaDto } from "./dto/create-mascota.dto";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { memoryStorage } from "multer";

@Controller("mascotas")
@UseGuards(AuthGuard("jwt"))
export class MascotasController {
  constructor(
    private readonly mascotasService: MascotasService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("foto", { storage: memoryStorage() }))
  async create(
    @Body() createMascotaDto: CreateMascotaDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let urlFoto = "";
    if (file) {
      urlFoto = await this.cloudinaryService.uploadImage(file);
    }
    return this.mascotasService.create(createMascotaDto, req.user, urlFoto);
  }

  @Get()
  async findAll() {
    return this.mascotasService.findAll();
  }

  @Get("mis-mascotas")
  async findMisMascotas(@Request() req: any) {
    return this.mascotasService.findByPropietario(req.user._id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.mascotasService.findOne(id);
  }
}
