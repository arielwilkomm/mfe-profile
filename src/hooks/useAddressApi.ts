import { useCallback } from 'react';
import { AddressFormValues } from '../schemas/addressSchema';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAddressApi() {
  const getAddresses = useCallback(async (cpf: string) => {
    const res = await fetch(`${API_URL}/v1/profile/${cpf}/address`);
    if (!res.ok) throw new Error('Erro ao buscar endereços');
    return res.json();
  }, []);

  const createAddress = useCallback(async (cpf: string, data: AddressFormValues) => {
    const res = await fetch(`${API_URL}/v1/profile/${cpf}/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar endereço');
    return res.json();
  }, []);

  const updateAddress = useCallback(
    async (cpf: string, addressId: string, data: AddressFormValues) => {
      const res = await fetch(`${API_URL}/v1/profile/${cpf}/address/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar endereço');
      return res.json();
    },
    []
  );

  const deleteAddress = useCallback(async (cpf: string, addressId: string) => {
    const res = await fetch(`${API_URL}/v1/profile/${cpf}/address/${addressId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao excluir endereço');
    return res.json();
  }, []);

  const getPostalCode = useCallback(async (postalCode: string) => {
    const res = await fetch(`${API_URL}/v1/postal-code/${postalCode}`);
    if (!res.ok) throw new Error('Erro ao buscar CEP');
    return res.json();
  }, []);

  return { getAddresses, createAddress, updateAddress, deleteAddress, getPostalCode };
}
