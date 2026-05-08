import { Controller, Get, Query } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async getPositions(@Query('userId') userId: string) {
    return this.positionsService.getUserPositions(userId);
  }
}