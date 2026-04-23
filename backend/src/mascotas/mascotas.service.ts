import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Mascota } from "./entities/mascota.entity";
import { CreateMascotaDto } from "./dto/create-mascota.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class MascotasService {
  constructor(
    @InjectModel(Mascota.name) private mascotaModel: Model<Mascota>,
  ) {}

  async create(
    createMascotaDto: CreateMascotaDto,
    user: User,
    urlFoto?: string
  ): Promise<Mascota> {
    return await this.mascotaModel.create({
      ...createMascotaDto,
      propietario: user._id,
      urlFoto: urlFoto || '',
    });
  }

  async findAll(): Promise<Mascota[]> {
    return await this.mascotaModel
      .find()
      .populate("propietario", "nombre email");
  }

  async findOne(id: string): Promise<Mascota> {
    const mascota = await this.mascotaModel
      .findById(id)
      .populate("propietario", "nombre email");

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    return mascota;
  }

  async findByPropietario(userId: string): Promise<Mascota[]> {
    return await this.mascotaModel
      .find({ propietario: userId })
      .populate("propietario", "nombre email");
  }
}
