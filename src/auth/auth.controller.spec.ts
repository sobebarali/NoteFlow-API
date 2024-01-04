import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User, UserSchema } from '../users/schema/users.schema';
import { jwtConstants } from './jwt/jwt.constants';
import { UsersService } from '../users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test_db'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    let stared = await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  it('/api/auth/signup (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        email: `test${Date.now()}@test.com`,
        password: 'strongPassword123',
      });
 

      console.log("response.body", response.body);
  });


});
