export class CreateOrderDto {
  userId!: string;
  symbol!: string;
  type!: 'BUY' | 'SELL';
  quantity!: number;
  price!: number;
}