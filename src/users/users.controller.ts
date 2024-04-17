import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
        try {
            return await this.usersService.create(createUserDto);
        } catch (error) {
            // 에러 메시지를 바로 접근
            if (error.message === '이미 등록된 이메일입니다.') {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            } else {
                // 다른 모든 서버 에러에 대한 처리
                throw new HttpException('서버 에러', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
