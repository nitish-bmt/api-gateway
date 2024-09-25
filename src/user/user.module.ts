import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UserController } from "./user.controller";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user.repository";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "./entity/role.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RoleRepository } from "./repository/role.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      UserRepository, 
      Role, 
      RoleRepository
    ]),
  ],
  providers: [
    UserService, 
    UserRepository, 
    RoleRepository, 
    AuthService, 
    JwtService, 
    JwtAuthGuard, 
    RolesGuard
  ],
  controllers: [
    UserController
  ],
  exports: [
    TypeOrmModule, 
    UserService, 
  ],
})
export class UserModule {
  constructor(private dataSource: DataSource){}
}