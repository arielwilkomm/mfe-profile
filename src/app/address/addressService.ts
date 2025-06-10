import { apiGet, apiPost, apiPut, apiDelete } from '../hooks/api';

export interface AddressRecordDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: 'RESIDENCIAL' | 'COMMERCIAL';
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

export async function getPostalCode(postalCode: string): Promise<any> {
  return apiGet<any>(`/v1/postal-code/${postalCode}`);
}

export async function updateAddress(
  cpf: string,
  addressId: string,
  data: AddressRecordDTO
): Promise<AddressRecordDTO> {
  return apiPut<AddressRecordDTO>(`/v1/profile/${cpf}/address/${addressId}`, data);
}

export async function deleteAddress(cpf: string, addressId: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/v1/profile/${cpf}/address/${addressId}`);
}
