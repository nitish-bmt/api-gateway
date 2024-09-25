import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { HttpExceptionFilter } from './global/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// new JwtAuthGuard(new Reflector),
  app.useGlobalGuards( new JwtAuthGuard(new Reflector));
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: [VERSION_NEUTRAL],
  //   // prefix: 'api/v',
  // });
  app.setGlobalPrefix('api/', { exclude:["healthcheck"] });

  app.useGlobalFilters(new HttpExceptionFilter());

  // app.useGlobalInter
  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);

}
bootstrap();
