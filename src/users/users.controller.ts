import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.create(createUserDto);
    }
}
