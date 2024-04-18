import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameCharactersController } from './game-characters/game-characters.controller';
import { GameCharactersService } from './game-characters/game-characters.service';
import { GameCharactersModule } from './game-characters/game-characters.module';
import { EquipmentModule } from './equipment/equipment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1522,
      username: 'witchend',
      password: 'root',
      sid: 'orcl', // or serviceName: 'yourServiceName'
      synchronize: true, // 개발 단계가 아닐 경우 false 추천
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: false // 필요에 따라 true로 설정
    }),
    UsersModule,
    GameCharactersModule,
    EquipmentModule,
  ],
  controllers: [AppController, GameCharactersController],
  providers: [AppService, GameCharactersService],
})
export class AppModule {}
