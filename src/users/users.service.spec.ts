import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let mockUserRepository: any;
    let mockJwtService: JwtService;

    beforeEach(async () => {
        mockUserRepository = createMockUserRepository();
        mockJwtService = {
            sign: jest.fn().mockReturnValue('some.jwt.token'),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByUsername', () => {
        it('should return a User if username is found', async () => {
            const mockUser = { id: 1, username: 'user1', email: 'test@example.com' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findByUsername('user1');
            expect(result).toEqual(mockUser);
        });

        it('should return null if username is not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.findByUsername('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should return a User if email is found', async () => {
            const mockUser = { id: 1, username: 'user1', email: 'test@example.com' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findByEmail('test@example.com');
            expect(result).toEqual(mockUser);
        });

        it('should return undefined if email is not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(undefined);

            const result = await service.findByEmail('nonexistent@example.com');
            expect(result).toBeUndefined();
        });
    });

    describe('findById', () => {
        it('should return a User if id is found', async () => {
            const mockUser = { id: 1, username: 'user1', email: 'test@example.com' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findById(1);
            expect(result).toEqual(mockUser);
        });

        it('should return undefined if id is not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(undefined);

            const result = await service.findById(999);
            expect(result).toBeUndefined();
        });
    });

    describe('create method', () => {
        let createUserDto: CreateUserDto;

        beforeEach(() => {
            createUserDto = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                nickname: 'testnick'
            };
        });

        it('should successfully create a new user when provided with valid data', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(createUserDto);
            mockUserRepository.save.mockResolvedValue(createUserDto);

            const result = await service.create(createUserDto);
            expect(result).toEqual(createUserDto);
            expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
        });

        it('should throw an error if the email already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(createUserDto);

            await expect(service.create(createUserDto)).rejects.toThrow(
                new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT)
            );
        });

        it('should throw an error if the username already exists', async () => {
            mockUserRepository.findOne
                .mockResolvedValueOnce(null)  // No user with this email
                .mockResolvedValueOnce(createUserDto);  // User with this username exists

            await expect(service.create(createUserDto)).rejects.toThrow(
                new HttpException('이미 등록된 아이디입니다.', HttpStatus.CONFLICT)
            );
        });
    });

    describe('login method', () => {
        let loginUserDto: LoginUserDto;
        const user = {
            id: 1,
            username: 'user1',
            password: bcrypt.hashSync('password123', 10)  // assume the password is already hashed in the db
        };

        beforeEach(() => {
            loginUserDto = {
                username: 'user1',
                password: 'password123'
            };
        });

        it('should return a JWT token when credentials are valid', async () => {
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.login(loginUserDto);
            expect(result).toEqual('some.jwt.token');
        });

        it('should throw an error if password does not match', async () => {
            mockUserRepository.findOne.mockResolvedValue(user);
            loginUserDto.password = 'wrongPassword';

            await expect(service.login(loginUserDto)).rejects.toThrow(
                new HttpException('아이디와 비밀번호를 다시 확인해주세요.', HttpStatus.NOT_FOUND)
            );
        });

        it('should throw an error if user does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.login(loginUserDto)).rejects.toThrow(
                new HttpException('아이디와 비밀번호를 다시 확인해주세요.', HttpStatus.NOT_FOUND)
            );
        });
    });

    describe('deleteUser', () => {
        it('should return true when the user is successfully deleted', async () => {
            const mockUserId = '1';
            mockUserRepository.delete.mockResolvedValue({ affected: 1 });  // Mocking delete method to simulate one row affected

            const result = await service.deleteUser(mockUserId);
            expect(result).toBe(true);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUserId);
        });

        it('should return false when no user is found to delete', async () => {
            const mockUserId = '999';  // Non-existent user ID
            mockUserRepository.delete.mockResolvedValue({ affected: 0 });  // Mocking delete method to simulate no rows affected

            const result = await service.deleteUser(mockUserId);
            expect(result).toBe(false);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('updateUser', () => {
        let updateUserDto: UpdateUserDto;
        let existingUser: User;

        beforeEach(() => {
            updateUserDto = {
                name: 'Updated Name',
                nickname: 'Updated Nickname',
                originalPassword: 'correctPassword',
                newPassword: 'newPassword123',
                email: 'update@example.com'
            };

            existingUser = new User('user1', bcrypt.hashSync('correctPassword', 10), 'Tester', 'test@example.com');
            existingUser.id = 1;
        });

        it('should return true when user is updated successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(existingUser);
            mockUserRepository.update.mockResolvedValue({ affected: 1 });

            const result = await service.updateUser(existingUser.id, updateUserDto);
            expect(result).toBe(true);
        });

        it('should throw an error when user does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(undefined);

            await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(
                new HttpException('존재하지 않는 회원입니다.', HttpStatus.NOT_FOUND)
            );
        });

        it('should throw an error when the original password does not match', async () => {
            updateUserDto.originalPassword = 'wrongPassword';
            mockUserRepository.findOne.mockResolvedValue(existingUser);

            await expect(service.updateUser(existingUser.id, updateUserDto)).rejects.toThrow(
                new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED)
            );
        });
    });
});

function createMockUserRepository() {
    return {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    };
}
