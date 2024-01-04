import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/users.schema';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Import the MongooseModule to connect to the database
        MongooseModule.forRoot('mongodb://localhost/test_db'),
        // Import the MongooseModule and provide the User schema
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        // Assuming you have some jwtConstants for JWT configuration
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      // Provide both AuthService and UsersService
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should successfully register a new user', async () => {
    const newUser = {
      email: `test${Date.now()}@test.com`,
      password: 'strongPassword123',
    };
    const result = await service.signUp(newUser);
    expect(result).toBeDefined();
    expect(result.email).toEqual(newUser.email);
  });

  it('should throw an error when trying to register with an existing email', async () => {
    try {
      const newUser = {
        email: `test${Date.now()}@test.com`,
        password: 'strongPassword123',
      };
      await service.signUp(newUser); // First registration

      // Second registration with the same email
      await service.signUp(newUser);
    } catch (e) {
      expect(e.message).toContain('Email already exists');
    }
  });

  it('should throw an error when the email is invalid', async () => {
    try {
      const newUser = {
        email: `test${Date.now()}`,
        password: 'strongPassword123',
      };
      await service.signUp(newUser);
    } catch (e) {
      expect(e.message).toContain('Validation failed');
    }
  });

  //Successful Login
  it('should successfully login a user', async () => {
    const newUser = {
      email: `test${Date.now()}@test.com`,
      password: 'strongPassword123',
    };
    await service.signUp(newUser);
    const result = await service.login(newUser);
    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });

  //Login with Incorrect Credentials
  it('should throw an error when trying to login with incorrect credentials', async () => {
    try {
      const newUser = {
        email: `test${Date.now()}@test.com`,
        password: 'strongPassword123',
      };
      await service.signUp(newUser);
      const result = await service.login({
        email: newUser.email,
        password: 'wrongPassword',
      });
    } catch (e) {
      expect(e.message).toContain('Unauthorized');
    }
  });

  //Login with Incomplete Data
  it('should throw an error when trying to login with incomplete data', async () => {
    try {
      const newUser = {
        email: `test${Date.now()}@test.com`,
        password: 'strongPassword123',
      };
      await service.signUp(newUser);
      const result = await service.login({
        email: newUser.email,
        password: '',
      });
    } catch (e) {
      expect(e.message).toContain('Unauthorized');
    }
  });
});
