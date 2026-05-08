'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPositions } from '../../src/services/api';

export default function PositionsPage() {
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    loadPositions();
  }, []);

  async function loadPositions() {
    const data = await getPositions('user-001');
    setPositions(data);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
        >
          ← Voltar para Home
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-3xl font-bold text-orange-400 text-center">
              Minha Posição
            </h1>

            <p className="text-gray-400 text-center mt-2">
              Resumo consolidado dos ativos do usuário
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Ativo
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Quantidade
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Preço Médio
                  </th>
                </tr>
              </thead>

              <tbody>
                {positions.length > 0 ? (
                  positions.map((pos, index) => (
                    <tr
                      key={pos.symbol}
                      className={`
                        border-t border-zinc-800
                        hover:bg-zinc-800/50
                        transition-colors
                        ${index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950'}
                      `}
                    >
                      <td className="py-5 px-6 font-bold text-lg text-white">
                        {pos.symbol}
                      </td>

                      <td className="py-5 px-6 text-gray-300">
                        {pos.quantity}
                      </td>

                      <td className="py-5 px-6 text-green-400 font-semibold">
                        R$ {Number(pos.averagePrice).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 text-gray-500 text-lg"
                    >
                      Nenhuma posição encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}