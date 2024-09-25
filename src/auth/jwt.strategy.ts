import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ensure token hasn't expired
      ignoreExpiration: false,
      // Use secret key from configuration
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  // Validate and decode the JWT payload
  async validate(payload: JwtPayload) {
    
    // Return a user object based on JWT payload
    return { userId: payload.userId, username: payload.username, roleId: payload.roleId };
  }
}