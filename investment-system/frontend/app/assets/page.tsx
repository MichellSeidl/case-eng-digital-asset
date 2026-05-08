'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAssets, createOrder } from '../../src/services/api';

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
      price: 1000000,
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

  if (loading)
    return (
      <p className="p-6 bg-black text-white min-h-screen">
        Carregando...
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <Link
        href="/"
        className="inline-block mb-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
      >
        ← Voltar para Home
      </Link>

      <h1 className="text-2xl font-bold mb-4 text-orange-400">
        Ativos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className="border border-zinc-700 bg-zinc-900 p-4 rounded-xl shadow"
          >
            <h2 className="font-bold text-xl text-orange-400">
              {asset.symbol}
            </h2>

            <p className="text-gray-400">{asset.name}</p>

            <button
              onClick={() => handleBuy(asset.symbol)}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Comprar
            </button>

            <button
              onClick={() => handleSell(asset.symbol)}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
            >
              Vender
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}