import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule} from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// Lo hago asi en vez de la manera que hay en los apuntes porque asi lee la URI desde el .env usando ConfigService 
// y asi el codigo no tiene ninguna credencial, de la otra forma estaba hardcodeada y quedaban expuestas las credenciales, 
// no creo que sea muy importante ahora mismo para estos ejercicios, pero lo veo mejor practica
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
