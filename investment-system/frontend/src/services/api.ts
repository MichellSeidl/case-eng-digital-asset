const API_URL = 'http://localhost:3000';

export async function getAssets() {
  try {
    const res = await fetch(`${API_URL}/assets`);

    if (!res.ok) {
      throw new Error('Erro ao buscar ativos');
    }

    return await res.json();
  } catch (error) {
    console.error('Backend indisponível:', error);

    return [];
  }
}

export async function createOrder(data: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
}

export async function getPositions(userId: string) {
  const res = await fetch(`${API_URL}/positions?userid=${userId}`);
  const data = await res.json();

  return data; // 👈 aqui está o ajuste
}

export async function cancelOrder(orderId: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

