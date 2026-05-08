'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders, cancelOrder } from '../../src/services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  async function loadOrders() {
    const data = await getOrders();
    setOrders(data);
  }

  async function handleCancel(orderId: string) {
    try {
      await cancelOrder(orderId);
      alert('Ordem cancelada');
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
        >
          ← Voltar para Home
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-3xl font-bold text-orange-400 text-center">
              Ordens
            </h1>

            <p className="text-gray-400 text-center mt-2">
              Acompanhamento das ordens em tempo real
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    ID
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Ativo
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Tipo
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Status
                  </th>

                  <th className="py-4 px-6 text-orange-400 font-semibold uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`
                        border-t border-zinc-800
                        hover:bg-zinc-800/50
                        transition-colors
                        ${index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950'}
                      `}
                    >
                      <td className="py-5 px-6 text-gray-300 font-mono">
                        {order.id.slice(0, 6)}
                      </td>

                      <td className="py-5 px-6 font-bold text-lg text-white">
                        {order.symbol}
                      </td>

                      <td className="py-5 px-6">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-sm font-semibold
                            ${
                              order.type === 'BUY'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }
                          `}
                        >
                          {order.type}
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="py-5 px-6">
                        {order.status === 'PENDING' ? (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-gray-500 text-lg"
                    >
                      Nenhuma ordem encontrada
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

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: 'bg-gray-500/20 text-gray-300',
    PROCESSING: 'bg-yellow-500/20 text-yellow-400',
    EXECUTED: 'bg-green-500/20 text-green-400',
    REJECTED: 'bg-red-500/20 text-red-400',
  };

  return (
    <span
      className={`
        ${styles[status]}
        px-4 py-1 rounded-full text-sm font-semibold
      `}
    >
      {status}
    </span>
  );
}