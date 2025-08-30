import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should register a new user successfully', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.register(registerData);

      expect(hashSpy).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerData.email,
          password: 'hashedPassword',
          name: registerData.name,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockToken);
    });

    it('should register a user without name', async () => {
      const registerDataWithoutName = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        name: null,
      });
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.register(registerDataWithoutName);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDataWithoutName.email,
          password: 'hashedPassword',
          name: undefined,
        },
      });
      expect(result).toEqual(mockToken);
    });

    it('should handle database errors during registration', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerData)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should login successfully with valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.login(loginData);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(compareSpy).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockToken);
    });

    it('should throw error when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
      expect(compareSpy).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });

    it('should handle database errors during login', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.login(loginData)).rejects.toThrow('Database error');
    });
  });

  describe('generateToken', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    };

    it('should generate token with correct payload', () => {
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = service['generateToken'](mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        userId: mockUser.id,
      });
      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
    });
  });
});
