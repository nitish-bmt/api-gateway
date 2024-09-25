import { Controller, Post, Body, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Roles } from '../utils/customDecorator/custom.decorator';
import { LoginUserDto } from 'src/user/dto/user.dto';
import { standardizeResponse } from '../utils/utilityFunction';
import { UserSuccess } from '../utils/constants/success.constant';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService){}

  @Public()
  @Post('login')
  async login(@Body() loginCredentials: LoginUserDto) {
    try{

      // throw new BadRequestException("Bad requ -nitish");
      const token: string = await this.authService.login(loginCredentials);
      return standardizeResponse(HttpStatus.ACCEPTED, UserSuccess.LOGGED_IN, token);
    }
    catch(error){ 
      throw error;
    }
  }
}
