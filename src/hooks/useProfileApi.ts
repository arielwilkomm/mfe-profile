import { useCallback } from 'react';
import { ProfileFormValues } from '../schemas/profileSchema';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useProfileApi() {
  const getProfiles = useCallback(async () => {
    const res = await fetch(`${API_URL}/v1/profile`);
    if (!res.ok) throw new Error('Erro ao buscar perfis');
    return res.json();
  }, []);

  const createProfile = useCallback(async (data: ProfileFormValues) => {
    const res = await fetch(`${API_URL}/v1/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar perfil');
    return res.json();
  }, []);

  const updateProfile = useCallback(async (cpf: string, data: ProfileFormValues) => {
    const res = await fetch(`${API_URL}/v1/profile/${cpf}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar perfil');
    return res.json();
  }, []);

  const deleteProfile = useCallback(async (cpf: string) => {
    const res = await fetch(`${API_URL}/v1/profile/${cpf}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir perfil');
    return res.json();
  }, []);

  return { getProfiles, createProfile, updateProfile, deleteProfile };
}
