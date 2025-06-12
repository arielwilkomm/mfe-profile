"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import { useProfileApi } from "../../hooks/useProfileApi";
import { ProfileForm } from "../../components/ProfileForm";
import { ProfileFormValues } from "../../schemas/profileSchema";
import React from "react";

export default function ProfilePage() {
    const { getProfiles, deleteProfile } = useProfileApi();
    const [profiles, setProfiles] = useState<ProfileFormValues[]>([]);
    const [error, setError] = useState("");
    const [selectedProfile, setSelectedProfile] = useState<ProfileFormValues | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cpfToDelete, setCpfToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfiles = async () => {
        try {
            const data = await getProfiles();
            setProfiles(Array.isArray(data) ? data : []);
        } catch {
            setError("Erro ao buscar perfis");
        }
    };

    const handleEdit = (profile: ProfileFormValues) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedProfile(null);
        setShowModal(true);
    };

    const handleDelete = async (cpf: string) => {
        setCpfToDelete(cpf);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (cpfToDelete) {
            await deleteProfile(cpfToDelete);
            setCpfToDelete(null);
            setShowDeleteModal(false);
            fetchProfiles();
        }
    };

    const cancelDelete = () => {
        setCpfToDelete(null);
        setShowDeleteModal(false);
    };

    const handleFormSuccess = () => {
        setSelectedProfile(null);
        setShowModal(false);
        fetchProfiles();
    };

    return (
        <Container>
            <div className="max-w-3xl mx-auto p-2 sm:p-6 flex flex-col items-center">
                <div className="w-full flex items-center mb-4">
                    <div className="flex-1" />
                    <h1 className="text-2xl font-bold text-center flex-1">Perfis de Usuário</h1>
                    <div className="flex-1 flex justify-end">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            style={{ minWidth: '140px' }}
                            onClick={handleCreate}
                        >
                            Criar usuário
                        </button>
                    </div>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <table className="min-w-[700px] w-full bg-white rounded-xl shadow-lg border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                <th className="border-b px-4 py-3 text-left font-semibold">Nome</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">CPF</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Email</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Telefone</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Endereços</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-2 text-center text-gray-500" colSpan={6}>
                                        Nenhum perfil encontrado
                                    </td>
                                </tr>
                            ) : (
                                profiles.map((profile, idx) => (
                                    <tr key={profile.cpf} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="px-4 py-2 border-b align-middle">{profile.name}</td>
                                        <td className="px-4 py-2 border-b align-middle">{profile.cpf}</td>
                                        <td className="px-4 py-2 border-b align-middle">{profile.email}</td>
                                        <td className="px-4 py-2 border-b align-middle">{profile.phone}</td>
                                        <td className="px-4 py-2 border-b align-middle">
                                            <a
                                                href={`/address?cpf=${profile.cpf}`}
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                Ir para endereços
                                            </a>
                                        </td>
                                        <td className="px-4 py-2 border-b align-middle whitespace-nowrap">
                                            <button
                                                className="text-yellow-600 underline hover:text-yellow-800 mr-2"
                                                type="button"
                                                onClick={() => handleEdit(profile)}
                                            >
                                                Alterar
                                            </button>
                                            <button
                                                className="text-red-600 underline hover:text-red-800"
                                                type="button"
                                                onClick={() => handleDelete(profile.cpf)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                            <h2 className="font-semibold mb-2">{selectedProfile ? "Editar perfil" : "Criar novo perfil"}</h2>
                            <ProfileForm
                                onSuccess={handleFormSuccess}
                                initialValues={selectedProfile || undefined}
                                isEdit={!!selectedProfile}
                            />
                        </div>
                    </div>
                )}
                {/* Modal de confirmação de exclusão */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                            <h2 className="font-semibold mb-4">Deseja realmente excluir este usuário?</h2>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={cancelDelete}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={confirmDelete}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}