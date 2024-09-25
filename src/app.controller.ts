  import { Controller, Get, UseGuards } from '@nestjs/common';
  import { AppService } from './app.service';
  import { Public } from './utils/customDecorator/custom.decorator';
  import { Verify } from 'crypto';
import { RolesGuard } from './auth/roles.guard';

  @UseGuards(RolesGuard)
  @Controller()
  export class AppV2Controller {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    getHelloV2(): string {
      return this.appService.getHelloV2();
    }
  }
