import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsString()
    originalPassword: string;

    @IsOptional()
    @IsString()
    newPassword?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
