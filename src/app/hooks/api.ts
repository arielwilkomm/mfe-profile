import { API_URL } from '../configs/config';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error('Erro na requisição GET');
  return res.json();
}

export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erro na requisição POST');
  return res.json();
}

export async function apiPut<T>(endpoint: string, body: any): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erro na requisição PUT');
  return res.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro na requisição DELETE');
  return res.json();
}

export async function getProfiles<T = any[]>(): Promise<T> {
  return apiGet<T>(`/v1/profile`);
}

export interface UserRecordDTO {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

export async function createUser(data: UserRecordDTO): Promise<UserRecordDTO> {
  return apiPost<UserRecordDTO>(`/v1/profile`, data);
}

export async function updateUser(cpf: string, data: UserRecordDTO): Promise<UserRecordDTO> {
  return apiPut<UserRecordDTO>(`/v1/profile/${cpf}`, data);
}

export async function deleteUser(cpf: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/v1/profile/${cpf}`);
}

export interface AddressRecordDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: 'RESIDENTIAL' | 'COMMERCIAL';
}

export async function getAddress(cpf: string, addressId: string): Promise<AddressRecordDTO> {
  return apiGet<AddressRecordDTO>(`/v1/profile/${cpf}/address/${addressId}`);
}

export async function createAddress(
  cpf: string,
  data: AddressRecordDTO
): Promise<AddressRecordDTO> {
  return apiPost<AddressRecordDTO>(`/v1/profile/${cpf}/address`, data);
}

export async function getAllAddresses(cpf: string): Promise<AddressRecordDTO[]> {
  return apiGet<AddressRecordDTO[]>(`/v1/profile/${cpf}/address`);
}

export async function getPostalCode(postalCode: string): Promise<any> {
  return apiGet<any>(`/v1/postal-code/${postalCode}`);
}
