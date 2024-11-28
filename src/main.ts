import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/roles/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management System')
    .setDescription('API documentation for the Task Manager application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // initiate auth guard
  // app.useGlobalGuards(new JwtAuthGuard());

  // initiate roles guard
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new RolesGuard(reflector));

  await app.listen(process.env.PORT);
  console.log('Server is running', process.env.PORT)
}
bootstrap();