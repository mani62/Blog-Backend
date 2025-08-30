import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const mockTokenResponse = {
      access_token: 'mock.jwt.token',
    };

    it('should register a new user successfully', async () => {
      mockAuthService.register.mockResolvedValue(mockTokenResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockTokenResponse);
    });

    it('should register a user without name', async () => {
      const registerDtoWithoutName: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockTokenResponse);

      const result = await controller.register(registerDtoWithoutName);

      expect(authService.register).toHaveBeenCalledWith(registerDtoWithoutName);
      expect(result).toEqual(mockTokenResponse);
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow('Registration failed');
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle validation errors from service', async () => {
      const error = new Error('Email already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockTokenResponse = {
      access_token: 'mock.jwt.token',
    };

    it('should login successfully with valid credentials', async () => {
      mockAuthService.login.mockResolvedValue(mockTokenResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockTokenResponse);
    });

    it('should handle login with invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle database errors during login', async () => {
      const error = new Error('Database connection failed');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow('Database connection failed');
    });

    it('should handle user not found errors', async () => {
      const error = new Error('User not found');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow('User not found');
    });
  });
});
