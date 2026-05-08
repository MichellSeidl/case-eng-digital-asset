import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { InMemoryQueueService } from '../../common/queue/in-memory-queue.service';
import { QuotationService } from '../../common/http/quotation.serivce';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService,
    @Inject(forwardRef(() => InMemoryQueueService))
    private queue: InMemoryQueueService, private quotationService: QuotationService,
    private transactionsService: TransactionsService,
  ) { }

  async createOrder(data: CreateOrderDto) {
    const { userId, symbol, type, quantity, price } = data;

    // 🔍 Validação básica
    if (!userId || !symbol || !type || !quantity || !price) {
      throw new BadRequestException('Dados inválidos');
    }

    if (quantity <= 0 || price <= 0) {
      throw new BadRequestException('Quantidade e preço devem ser positivos');
    }

    // 🔥 REGRA CRÍTICA: validação de saldo para venda
    if (type === 'SELL') {
      const position = await this.prisma.position.findUnique({
        where: {
          userId_symbol: {
            userId,
            symbol,
          },
        },
      });

      if (!position || position.quantity < quantity) {
        throw new BadRequestException(
          'Saldo insuficiente para realizar a venda',
        );
      }
    }

    // 🧾 Criar ordem
    const order = await this.prisma.order.create({
      data: {
        userId,
        symbol,
        type,
        quantity,
        price,
        status: 'PENDING',
      },
    });

    this.queue.enqueue({ orderId: order.id });

    return order;
  }

  async processOrder(orderId: string) {
    console.log(`Processando ordem ${orderId}`);
    // Buscar ordem
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    // Atualiza status para PROCESSING
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    try {
      // 🔥 chamada real ao serviço instável
      const quotation = await this.quotationService.getQuotation(order.symbol);

      const currentPrice = quotation.price;

      // (regra simples por enquanto)
      const shouldExecute =
        order.type === 'BUY'
          ? order.price >= currentPrice
          : order.price <= currentPrice;

      if (!shouldExecute) {
        throw new Error('Preço não favorável');
      }

      await this.prisma.$transaction(async (tx) => {
        // 🔍 buscar posição atual
        const position = await tx.position.findUnique({
          where: {
            userId_symbol: {
              userId: order.userId,
              symbol: order.symbol,
            },
          },
        });

        if (order.type === 'BUY') {
          // ➕ aumenta saldo
          if (position) {
            await tx.position.update({
              where: {
                userId_symbol: {
                  userId: order.userId,
                  symbol: order.symbol,
                },
              },
              data: {
                quantity: position.quantity + order.quantity,
              },
            });
          } else {
            await tx.position.create({
              data: {
                userId: order.userId,
                symbol: order.symbol,
                quantity: order.quantity,
                averagePrice: order.price,
              },
            });
          }
        }

        if (order.type === 'SELL') {
          // ➖ diminui saldo
          if (!position || position.quantity < order.quantity) {
            throw new Error('Saldo insuficiente durante processamento');
          }

          await tx.position.update({
            where: {
              userId_symbol: {
                userId: order.userId,
                symbol: order.symbol,
              },
            },
            data: {
              quantity: position.quantity - order.quantity,
            },
          });
        }

        // 🧾 registrar transação
        await this.transactionsService.createTransaction(tx, {
          userId: order.userId,
          orderId: order.id,
          symbol: order.symbol,
          type: order.type,
          quantity: order.quantity,
          price: order.price,
        });

        // ✅ atualizar status da ordem
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'EXECUTED' },
        });
      });
    } catch (error) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'REJECTED' },
      });
    }
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Ordem não encontrada');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Só é possível cancelar ordens pendentes');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }
}
