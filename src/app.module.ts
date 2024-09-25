import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { AppV2Controller } from './app.controller';
import { AppService } from './app.service';
import { Role } from './user/entity/role.entity';
import { AuthController } from './auth/auth.controller';
import { RolesGuard } from './auth/roles.guard';
import { HttpExceptionFilter } from './global/http-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRESS_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.POSTGRES_USER, 
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DB,
        entities: [User, Role],  
        synchronize: true,  //don't use in production (might llose data)
      })
    }),     
    HealthcheckModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  // AppController,
  controllers: [ AppV2Controller, AuthController], 
  providers:[
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Set up RolesGuard as a global guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    JwtStrategy
  ]
})
export class AppModule {

}
