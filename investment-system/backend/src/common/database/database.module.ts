import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { QuotationService } from '../http/quotation.serivce';

@Global()
@Module({
  providers: [PrismaService, QuotationService],
  exports: [PrismaService, QuotationService],
})
export class DatabaseModule { }