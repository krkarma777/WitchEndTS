import {Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UsersService} from './users.service';
import {LoginUserDto} from "./dto/login-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

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
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
        const successful = await this.usersService.updateUser(id, updateUserDto);
        if (!successful) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }
}
