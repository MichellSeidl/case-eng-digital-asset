'use client';

import { useEffect, useState } from 'react';
import { getAssets, createOrder } from '../src/services/api';

export default function Home() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    const data = await getAssets();
    setAssets(data);
    setLoading(false);
  }

  async function handleBuy(symbol: string) {
    await createOrder({
      userId: 'user-001',
      symbol,
      type: 'BUY',
      quantity: 1,
      price: 1000000, // alto pra garantir execução
    });

    alert(`Ordem de compra enviada para ${symbol}`);
  }

  async function handleSell(symbol: string) {
    try {
      await createOrder({
        userId: 'user-001',
        symbol,
        type: 'SELL',
        quantity: 1,
        price: 0,
      });

      alert(`Venda enviada para ${symbol}`);
    } catch (error: any) {
      alert(error.message);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ativos</h1>

      <div className="grid grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div key={asset.symbol} className="border p-4 rounded shadow">
            <h2 className="font-bold">{asset.symbol}</h2>
            <p>{asset.name}</p>

            <button
              onClick={() => handleBuy(asset.symbol)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Comprar
            </button>

            <button
              onClick={() => handleSell(asset.symbol)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded ml-2"
            >
              Vender
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}