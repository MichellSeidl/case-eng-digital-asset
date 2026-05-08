import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class QuotationService {
  private baseUrl = 'http://localhost:3001';

  async getQuotation(symbol: string) {
    return this.retry(async () => {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 3000); // ⏱ timeout de 3s

      try {
        const response = await fetch(
          `${this.baseUrl}/quotations/${symbol}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        return data.data; // { symbol, price, ... }
      } catch (error) {
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    });
  }

  // 🔁 Retry simples
  private async retry(fn: () => Promise<any>, retries = 3) {
    let lastError;

    for (let i = 0; i < retries; i++) {
      console.log(`Tentativa ${i + 1}`);
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // pequena pausa antes de tentar de novo
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    throw new HttpException(
      'Falha ao obter cotação após múltiplas tentativas',
      503,
    );
  }
}