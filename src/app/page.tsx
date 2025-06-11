"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProfiles, createUser, updateUser, deleteUser, UserRecordDTO } from './hooks/api';

export default function ProfilePage() {
  const [users, setUsers] = useState<UserRecordDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<UserRecordDTO>({ name: '', cpf: '', email: '', phone: '' });
  const [editingCpf, setEditingCpf] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getProfiles()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError('Erro ao buscar usuários'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (editingCpf) {
        await updateUser(editingCpf, form);
      } else {
        await createUser(form);
      }
      setForm({ name: '', cpf: '', email: '', phone: '' });
      setEditingCpf(null);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar usuário');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (user: UserRecordDTO) => {
    setForm(user);
    setEditingCpf(user.cpf);
  };

  const handleDelete = async (cpf: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteUser(cpf);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <form className="mb-6 border p-4 rounded" onSubmit={handleSubmit}>
        <h2 className="font-semibold mb-2">{editingCpf ? 'Editar usuário' : 'Cadastrar novo usuário'}</h2>
        <input
          className="border p-2 mb-2 w-full"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          className="border p-2 mb-2 w-full"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleFormChange}
          required
          disabled={!!editingCpf}
        />
        <input
          className="border p-2 mb-2 w-full"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleFormChange}
          required
        />
        <input
          className="border p-2 mb-2 w-full"
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleFormChange}
          required
        />
        <button
          className="bg-green-500 text-white px-4 py-2 mr-2"
          type="submit"
          disabled={formLoading}
        >
          {editingCpf ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {editingCpf && (
          <button
            className="bg-gray-400 text-white px-4 py-2"
            type="button"
            onClick={() => { setForm({ name: '', cpf: '', email: '', phone: '' }); setEditingCpf(null); }}
          >
            Cancelar
          </button>
        )}
      </form>
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
                <th className="border px-2 py-1">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td className="border px-2 py-1 text-center" colSpan={6}>Nenhum usuário encontrado</td>
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
                    <td className="border px-2 py-1">
                      <button
                        className="text-yellow-600 underline mr-2"
                        type="button"
                        onClick={() => handleEdit(user)}
                      >
                        Alterar
                      </button>
                      <button
                        className="text-red-600 underline"
                        type="button"
                        onClick={() => handleDelete(user.cpf)}
                      >
                        Excluir
                      </button>
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