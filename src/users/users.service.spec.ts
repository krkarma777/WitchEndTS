import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: any;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockUserRepository = createMockUserRepository();
    mockJwtService = { sign: jest.fn() };

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