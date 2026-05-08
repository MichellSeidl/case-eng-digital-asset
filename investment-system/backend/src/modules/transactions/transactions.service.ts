import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(tx: any, data: {
    userId: string;
    orderId: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) {
    return tx.transaction.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        symbol: data.symbol,
        type: data.type,
        quantity: data.quantity,
        price: data.price,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}