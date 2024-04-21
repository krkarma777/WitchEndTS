import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        forwardRef(() => UsersModule), // forwardRef 사용
        PassportModule,
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtModule], // JwtModule도 export해야 다른 모듈에서 사용 가능
})
export class AuthModule {}
