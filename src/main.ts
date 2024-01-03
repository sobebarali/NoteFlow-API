import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
const winston = require('winston');
require('winston-mongodb');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Winston logger
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      // - Write to all logs with specified level to MongoDB
      new winston.transports.MongoDB({
        db: process.env.MONGO_URI || 'mongodb://localhost/nest',
        collection: 'logs',
        level: 'info',
      }),
    ],
  });

  // Winston logger for development
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove non-whitelisted properties
      forbidNonWhitelisted: true, // throw an error if non-whitelisted properties are present
      transform: true, // transform payload to DTO instance
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
