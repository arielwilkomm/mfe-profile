"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react';
import { getProfiles } from './hooks/api';

export default function ProfilePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getProfiles()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(e => setError('Erro ao buscar usuários'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Usuários cadastrados</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Nome</th>
                <th className="border px-2 py-1">CPF</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Telefone</th>
                <th className="border px-2 py-1">Endereços</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td className="border px-2 py-1 text-center" colSpan={5}>Nenhum usuário encontrado</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{user.name || '-'}</td>
                    <td className="border px-2 py-1">{user.cpf || '-'}</td>
                    <td className="border px-2 py-1">{user.email || '-'}</td>
                    <td className="border px-2 py-1">{user.phone || '-'}</td>
                    <td className="border px-2 py-1">
                      {user.cpf ? (
                        <Link href={`/address?cpf=${user.cpf}`} className="text-blue-600 underline">Ver endereços</Link>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}