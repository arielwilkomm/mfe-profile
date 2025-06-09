const API_URL = 'http://localhost:8090/v1';

export async function getProfile(cpf: string) {
  const res = await fetch(`${API_URL}/profile/${cpf}`);
  if (!res.ok) throw new Error('Erro ao buscar perfil');
  return res.json();
}

export async function getAddresses(cpf: string) {
  const res = await fetch(`${API_URL}/address/${cpf}`);
  if (!res.ok) throw new Error('Erro ao buscar endereços');
  return res.json();
}

export async function getPostalCode(postalCode: string) {
  const res = await fetch(`${API_URL}/postal-code/${postalCode}`);
  if (!res.ok) throw new Error('Erro ao buscar postal code');
  return res.json();
}