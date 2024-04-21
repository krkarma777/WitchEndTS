import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    nickname: string;
}
