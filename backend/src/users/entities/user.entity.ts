import  { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, index: true, lowercase: true})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserRole, default: UserRole.USER})
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('versionKey', false)