import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async getUserPositions(userId: string) {
    return this.prisma.position.findMany({
      where: {
        userId,
      },
    });
  }
}