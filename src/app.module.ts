import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'krkarma777',
      password: 'root',
      sid: 'xe', // or serviceName: 'yourServiceName'
      synchronize: false, // 개발 단계가 아닐 경우 false 추천
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: false // 필요에 따라 true로 설정
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
