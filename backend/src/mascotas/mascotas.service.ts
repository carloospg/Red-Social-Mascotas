import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Mascota } from "./entities/mascota.entity";
import { CreateMascotaDto } from "./dto/create-mascota.dto";
import { User, UserRole } from "src/users/entities/user.entity";
import { UpdateMascotaDto } from "./dto/update-mascota.dto";

@Injectable()
export class MascotasService {
  constructor(
    @InjectModel(Mascota.name) private mascotaModel: Model<Mascota>,
  ) {}

  async create(
    createMascotaDto: CreateMascotaDto,
    user: User,
    urlFoto?: string,
  ): Promise<Mascota> {
    return await this.mascotaModel.create({
      ...createMascotaDto,
      especie: createMascotaDto.especie.trim().toLowerCase(),
      propietario: user._id,
      urlFoto: urlFoto || "",
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

  async update(
    id: string,
    updateMascotaDto: UpdateMascotaDto,
    user: User,
    urlFoto?: string,
  ): Promise<Mascota | null> {
    const mascota = await this.mascotaModel.findById(id);

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    if (
      mascota.propietario.toString() !== user._id.toString() &&
      user.rol !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        "No tienes permiso para editar esta mascota",
      );
    }

    const updateData: any = { ...updateMascotaDto };
    if (updateData.especie) {
      updateData.especie = updateData.especie.trim().toLowerCase();
    }
    if (urlFoto) {
      updateData.urlFoto = urlFoto;
    }

    return await this.mascotaModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });
  }

  async delete(id: string, user: User): Promise<void> {
    const mascota = await this.mascotaModel.findById(id);

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    if (
      mascota.propietario.toString() !== user._id.toString() &&
      user.rol !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        "No tienes permiso para eliminar esta mascota",
      );
    }

    await this.mascotaModel.findByIdAndDelete(id);
  }

  async darLike(id: string, user: User): Promise<Mascota | null> {
    const mascota = await this.mascotaModel.findById(id);

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    const yaHaDadoLike = mascota.likesDados.some(
      //some recorre el array y devuelve true si al menos un elemento cumple la condicion, si no la comple devuelve false
      (userId) => userId.toString() === user._id.toString(),
    );

    if (yaHaDadoLike) {
      return await this.mascotaModel.findByIdAndUpdate(
        id,
        {
          $inc: { contadorLikes: -1 },
          $pull: {
            likesDados: user._id,
            historialLikes: { usuario: user._id },
          },
        },
        { returnDocument: "after" },
      );
    } else {
      return await this.mascotaModel.findByIdAndUpdate(
        id,
        {
          $inc: { contadorLikes: 1 },
          $push: {
            likesDados: user._id,
            historialLikes: { usuario: user._id, fecha: new Date() },
          },
        },
        { returnDocument: "after" },
      );
    }
  }

  async comentar(
    id: string,
    texto: string,
    user: User,
  ): Promise<Mascota | null> {
    const mascota = await this.mascotaModel.findById(id);

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    return await this.mascotaModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comentarios: { usuario: user._id, texto, fecha: new Date() },
        },
      },
      { returnDocument: "after" },
    );
  }

  async getComentarios(id: string): Promise<any[]> {
    const mascota = await this.mascotaModel
      .findById(id)
      .populate("comentarios.usuario", "nombre");

    if (!mascota) {
      throw new NotFoundException("Mascota no encontrada");
    }

    return mascota.comentarios;
  }

  async getRanking(especie?: string): Promise<Mascota[]> {
    const filtro: any = {};
    if (especie) {
      filtro.especie = { $regex: especie, $options: "i" }; // Insensible a mayusculas para filtrar bien
    }

    return await this.mascotaModel
      .find(filtro)
      .sort({ contadorLikes: -1 })
      .populate("propietario", "nombre email");
  }

  async getEspecies(): Promise<string[]> {
    return await this.mascotaModel.distinct('especie');
  }
}
