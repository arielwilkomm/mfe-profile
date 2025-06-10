const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AddressRecordDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: 'RESIDENCIAL' | 'COMMERCIAL';
}

export async function getAddress(cpf: string, addressId: string) {
  const res = await fetch(`${API_URL}/v1/profile/${cpf}/address/${addressId}`);
  if (!res.ok) throw new Error('Erro ao buscar endereço');
  return res.json();
}

export async function createAddress(cpf: string, data: AddressRecordDTO) {
  const res = await fetch(`${API_URL}/v1/profile/${cpf}/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar endereço');
  return res.json();
}
