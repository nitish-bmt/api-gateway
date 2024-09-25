import { Injectable } from "@nestjs/common";
import { HealthcheckDto } from "./dto/healthcheck.dto";

@Injectable()
export class HealthcheckService{
  
  healthcheck(): HealthcheckDto{
    const healthResponse = new HealthcheckDto;
    healthResponse.status = 200;
    healthResponse.message = "Server is running";
    healthResponse.serverUptime = this.formattedServerUptime();
    return healthResponse;
  }
  
  formattedServerUptime(): string{
    const uptime = process.uptime();
    return `${Math.floor(uptime/(60*60))}hrs ${Math.floor((uptime%(60*60))/60)}mins ${Math.floor(uptime%60)}secs`;
  }

}
