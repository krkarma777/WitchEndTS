import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {
    }

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

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { id }
        });
    }

    async login(loginUserDto: LoginUserDto): Promise<string | null> {
        const user = await this.usersRepository.findOne({
            where: { username: loginUserDto.username }
        });

        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            const payload = { username: user.username, sub: user.id };
            return this.jwtService.sign(payload);
        }

        throw new HttpException('아이디와 비밀번호를 다시 확인해주세요.', HttpStatus.NOT_FOUND)
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.usersRepository.delete(id);
        return result.affected > 0;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
        let user = await this.findById(id);

        if (!user) {
            throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.NOT_FOUND);
        }

        if (!(await bcrypt.compare(updateUserDto.originalPassword, user.password))) {
            throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
        }

        const result = await this.usersRepository.update(id, updateUserDto);
        return result.affected > 0;
    }
}
