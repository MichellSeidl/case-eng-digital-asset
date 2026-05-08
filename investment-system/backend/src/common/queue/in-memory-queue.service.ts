import { Injectable, OnModuleInit, Inject, forwardRef  } from '@nestjs/common';
import { OrdersService } from '../../modules/orders/orders.service';

type Job = {
  orderId: string;
};

@Injectable()
export class InMemoryQueueService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}
  private queue: Job[] = [];
  private processing = false;

  onModuleInit() {
    this.startWorker();
  }

  enqueue(job: Job) {
    this.queue.push(job);
  }

  private async startWorker() {
    if (this.processing) return;

    this.processing = true;

    while (true) {
      const job = this.queue.shift();

      if (!job) {
        await this.sleep(500); // evita loop agressivo
        continue;
      }

      try {
        await this.process(job);
      } catch (error) {
        console.error('Erro ao processar job:', error);
      }
    }
  }

  // 👇 vamos sobrescrever isso depois
  async process(job: Job) {
    await this.ordersService.processOrder(job.orderId);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}