import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuário
  await prisma.user.create({
    data: {
      id: 'user-001',
      name: 'João Investidor',
    },
  });

  // Ativos
  await prisma.asset.createMany({
        data: [
            {
            symbol: 'ITUB4',
            name: 'Itaú Unibanco PN'
            },
            {
            symbol: 'ITUB3',
            name: 'Itaú Unibanco ON'
            },
            {
            symbol: 'USDC',
            name: 'USD Coin'
            },
            {
            symbol: 'SOL',
            name: 'Solana'
            },
            {
            symbol: 'BTC',
            name: 'Bitcoin'
            },
            {
            symbol: 'ETH',
            name: 'Ethereum'
            },
        ],
    });

  // Posição inicial
  await prisma.position.createMany({
    data: [
      {
        userId: 'user-001',
        symbol: 'ITUB4',
        quantity: 100,
        averagePrice: 30,
      },
      {
        userId: 'user-001',
        symbol: 'USDC',
        quantity: 50,
        averagePrice: 3.94,
      },
    ],
  });
}

main()
  .then(() => console.log('Seed executado'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());