import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entities/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {LoginUserDto} from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingEmail = await this.findByEmail(createUserDto.email);
        if (existingEmail) {
            throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);
        }

        const existingUsername = await this.findByUsername(createUserDto.username);
        if (existingUsername) {
            throw new HttpException('이미 등록된 아이디입니다.', HttpStatus.CONFLICT);
        }

        createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
        const newUser = this.usersRepository.create(createUserDto);
        await this.usersRepository.save(newUser);
        return newUser;
    }


    async findByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: { username },
        })
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { email }
        });
    }

    async login(loginUserDto: LoginUserDto): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: { email: loginUserDto.email }
        });

        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            return true; // 로그인 성공
        }

        return false; // 로그인 실패
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.usersRepository.delete(id);
        return result.affected > 0;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
        const result = await this.usersRepository.update(id, updateUserDto);
        return result.affected > 0;
    }
}
