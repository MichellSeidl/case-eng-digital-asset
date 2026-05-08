'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-orange-500">
          Investment Order System
        </h1>

        <p className="text-gray-400 mb-8">
          Case Digital Assets - Sistema de Ordens de Investimento
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/assets">
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 hover:shadow-orange-500/20 hover:border-orange-500 transition-all duration-300 cursor-pointer border border-zinc-800 hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-2 text-orange-400">
                Ativos
              </h2>

              <p className="text-gray-400">
                Visualizar ativos disponíveis e criar ordens.
              </p>
            </div>
          </Link>

          <Link href="/orders">
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 hover:shadow-orange-500/20 hover:border-orange-500 transition-all duration-300 cursor-pointer border border-zinc-800 hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-2 text-orange-400">
                Ordens
              </h2>

              <p className="text-gray-400">
                Acompanhar status das ordens em tempo real.
              </p>
            </div>
          </Link>

          <Link href="/positions">
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 hover:shadow-orange-500/20 hover:border-orange-500 transition-all duration-300 cursor-pointer border border-zinc-800 hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-2 text-orange-400">
                Posições
              </h2>

              <p className="text-gray-400">
                Consultar saldo consolidado do usuário.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-10 bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-800">
          <h3 className="text-xl font-semibold mb-4 text-orange-400">
            Fluxo do Sistema
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Consulta de ativos
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Criação de ordens
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Processamento assíncrono
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Retry e timeout
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Atualização automática de status
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">✔</span>
              Controle de concorrência
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}