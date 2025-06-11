import {
  apiPut,
  apiDelete,
  AddressRecordDTO,
  getAddress,
  createAddress,
  getPostalCode,
  getAllAddresses,
} from '../hooks/api';

export interface UserRecordDTO {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

// Funções de endereço permanecem aqui
export { getAddress, createAddress, getPostalCode, getAllAddresses };

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

export type { AddressRecordDTO };
