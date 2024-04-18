import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UsersService} from './users.service';
import {LoginUserDto} from "./dto/login-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {User} from "./entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.create(createUserDto);
    }

    @Post('login')
    async signIn(@Body() loginUserDto: LoginUserDto): Promise<Boolean> {
        return await this.usersService.login(loginUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        const result = await this.usersService.deleteUser(id);
        if (!result) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Patch(':id')
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<void> {
        const successful = await this.usersService.updateUser(id, updateUserDto);
        if (!successful) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id')
    async getUser(@Param('id') id: number): Promise<User> {
        return await this.usersService.findById(id);
    }
}
