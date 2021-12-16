import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackedEntityInstanceNotFoundException extends HttpException {
  constructor() {
    super('Tracked Entity Instance Not Found', HttpStatus.NOT_FOUND);
  }
}
