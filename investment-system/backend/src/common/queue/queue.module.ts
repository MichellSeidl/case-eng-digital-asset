import { forwardRef, Module } from '@nestjs/common';
import { InMemoryQueueService } from './in-memory-queue.service';
import { OrdersModule } from '../../modules/orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [InMemoryQueueService],
  exports: [InMemoryQueueService],
})
export class QueueModule {}