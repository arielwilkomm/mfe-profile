"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    getProfiles,
    createUser,
    updateUser,
    deleteUser,
    UserRecordDTO,
} from "./profileService";

export default function ProfilePage() {
    const [profiles, setProfiles] = useState<UserRecordDTO[]>([]);
    const [form, setForm] = useState<UserRecordDTO>({
        name: "",
        cpf: "",
        email: "",
        phone: "",
    });
    const [editingCpf, setEditingCpf] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const data = await getProfiles();
            setProfiles(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError("Erro ao buscar perfis");
        }
    };

    const handleCreate = async () => {
        setError("");
        try {
            await createUser(form);
            setForm({ name: "", cpf: "", email: "", phone: "" });
            fetchProfiles();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleUpdate = async () => {
        if (!editingCpf) return;
        setError("");
        try {
            await updateUser(editingCpf, form);
            setForm({ name: "", cpf: "", email: "", phone: "" });
            setEditingCpf(null);
            fetchProfiles();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleDelete = async (cpf: string) => {
        setError("");
        try {
            await deleteUser(cpf);
            fetchProfiles();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleEdit = (profile: UserRecordDTO) => {
        setForm(profile);
        setEditingCpf(profile.cpf);
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Perfis de Usuário</h1>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <table className="min-w-full border text-sm mb-4">
                <thead>
                    <tr>
                        <th className="border px-2 py-1">Nome</th>
                        <th className="border px-2 py-1">CPF</th>
                        <th className="border px-2 py-1">Email</th>
                        <th className="border px-2 py-1">Telefone</th>
                        <th className="border px-2 py-1">Ações</th>
                        <th className="border px-2 py-1">Endereços</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.length === 0 ? (
                        <tr>
                            <td className="border px-2 py-1 text-center" colSpan={6}>
                                Nenhum perfil encontrado
                            </td>
                        </tr>
                    ) : (
                        profiles.map((profile) => (
                            <tr key={profile.cpf}>
                                <td className="border px-2 py-1">{profile.name}</td>
                                <td className="border px-2 py-1">{profile.cpf}</td>
                                <td className="border px-2 py-1">{profile.email}</td>
                                <td className="border px-2 py-1">{profile.phone}</td>
                                <td className="border px-2 py-1">
                                    <button
                                        className="text-yellow-600 underline mr-2"
                                        type="button"
                                        onClick={() => handleEdit(profile)}
                                    >
                                        Alterar
                                    </button>
                                    <button
                                        className="text-red-600 underline"
                                        type="button"
                                        onClick={() => handleDelete(profile.cpf)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                                <td className="border px-2 py-1">
                                    <a
                                        href={`/address?cpf=${profile.cpf}`}
                                        className="text-blue-600 underline"
                                    >
                                        Ir para endereços
                                    </a>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="mb-4">
                <h2 className="font-semibold mb-2">
                    {editingCpf ? "Alterar perfil" : "Criar novo perfil"}
                </h2>
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Nome"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="CPF"
                    value={form.cpf}
                    onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                    disabled={!!editingCpf}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Telefone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                {editingCpf ? (
                    <>
                        <button
                            className="bg-green-500 text-white px-4 py-2"
                            onClick={handleUpdate}
                        >
                            Salvar alterações
                        </button>
                        <button
                            className="bg-gray-400 text-white px-4 py-2 ml-2"
                            type="button"
                            onClick={() => {
                                setForm({ name: "", cpf: "", email: "", phone: "" });
                                setEditingCpf(null);
                            }}
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-green-500 text-white px-4 py-2"
                        onClick={handleCreate}
                    >
                        Criar
                    </button>
                )}
            </div>
        </div>
    );
}