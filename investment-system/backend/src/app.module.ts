import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { AssetsModule } from './modules/assets/assets.module';
import { PositionsModule } from './modules/positions/positions.module';
import { DatabaseModule } from './common/database/database.module';
import { QueueModule } from './common/queue/queue.module';

@Module({
  imports: [OrdersModule, AssetsModule, PositionsModule, DatabaseModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
