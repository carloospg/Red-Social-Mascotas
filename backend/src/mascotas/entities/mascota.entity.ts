import { Document, Types } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";

@Schema({ collection: "mascotas", timestamps: true })
export class Mascota extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  especie: string;

  @Prop({ required: true, min: 0 })
  edad: number;

  @Prop({})
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  propietario: Types.ObjectId;

  @Prop({ default: 0 })
  contadorLikes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  likesDados: Types.ObjectId[];

  @Prop({
    type: [
      {
        usuario: { type: Types.ObjectId, ref: User.name },
        fecha: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  historialLikes: { usuario: Types.ObjectId; fecha: Date }[];

  @Prop({
    type: [
      {
        usuario: { type: Types.ObjectId, ref: User.name },
        texto: { type: String, required: true },
        fecha: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comentarios: { usuario: Types.ObjectId; texto: string; fecha: Date }[];

  @Prop({})
  urlFoto: string;
}

export const MascotaSchema = SchemaFactory.createForClass(Mascota);
MascotaSchema.set("versionKey", false);