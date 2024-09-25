import { Injectable } from '@nestjs/common';
import { Public } from './utils/customDecorator/custom.decorator';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloV2(): string {
    return 'Hola! V2';
  }
}
