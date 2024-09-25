import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { JwtPayload } from '../utils/types';
import { LoginUserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';
import { AuthError, ErrorMessages } from '../utils/constants/errors.constant';

// Authentication service responsible for handling user login and authentication.
@Injectable()
export class AuthService {

  // Constructor to inject dependencies.
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Generate a JWT token for an authenticated user.
  async login(loginData: LoginUserDto): Promise<string> {
    let user: User;

    // Attempt to authenticate the user using the provided login data.
    try {
      user = await this.userService.authenticateUser(loginData.username, loginData.password);
    }
    catch (error) {
      // If authentication fails, re-throw the error.
      throw error;
    }

    // Check if the authenticated user is active.
    if (!user.isActive) {
      // If the user is not active, throw an unauthorized exception.
      throw new UnauthorizedException(AuthError.INACTIVE_USER);
    }

    // Create a JWT payload containing the user's details.
    const payload: JwtPayload = { username: user.username, userId: user.id, roleId: user.roleId };

    // Generate and return a JWT token.
    return this.jwtService.sign(payload);
  }
} 