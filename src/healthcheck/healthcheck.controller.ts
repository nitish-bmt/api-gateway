import { Controller, Get } from '@nestjs/common';
import { HealthcheckDto } from './dto/healthcheck.dto';
import { HealthcheckService } from './healthcheck.service';
import { Public } from '../utils/customDecorator/custom.decorator';

@Public()
@Controller('healthcheck')
export class HealthcheckController {  
  constructor(private healthcheckService: HealthcheckService){}

  @Get()
  handler(): HealthcheckDto{
    return this.healthcheckService.healthcheck();
  }
}
