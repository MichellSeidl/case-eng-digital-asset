import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../common/database/prisma.service';

@Module({
  providers: [TransactionsService, PrismaService],
  exports: [TransactionsService],
})
export class TransactionsModule {}