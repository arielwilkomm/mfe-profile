"use client";

import { useEffect, useState } from "react";
import { useProfileApi } from "../../hooks/useProfileApi";
import { ProfileForm } from "../../components/ProfileForm";
import { ProfileFormValues } from "../../schemas/profileSchema";

export default function ProfilePage() {
    const { getProfiles, deleteProfile } = useProfileApi();
    const [profiles, setProfiles] = useState<ProfileFormValues[]>([]);
    const [error, setError] = useState("");
    const [selectedProfile, setSelectedProfile] = useState<ProfileFormValues | null>(null);

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
    };

    const handleDelete = async (cpf: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este perfil?")) return;
        await deleteProfile(cpf);
        fetchProfiles();
    };

    const handleFormSuccess = () => {
        setSelectedProfile(null);
        fetchProfiles();
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
                        <th className="border px-2 py-1">Endereços</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.length === 0 ? (
                        <tr>
                            <td className="border px-2 py-1 text-center" colSpan={5}>
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
                                    <a
                                        href={`/address?cpf=${profile.cpf}`}
                                        className="text-blue-600 underline"
                                    >
                                        Ir para endereços
                                    </a>
                                    <button
                                        className="ml-2 text-yellow-600 underline"
                                        type="button"
                                        onClick={() => handleEdit(profile)}
                                    >
                                        Alterar
                                    </button>
                                    <button
                                        className="ml-2 text-red-600 underline"
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
            <div className="mb-4">
                <h2 className="font-semibold mb-2">{selectedProfile ? "Editar perfil" : "Criar novo perfil"}</h2>
                <ProfileForm
                    onSuccess={handleFormSuccess}
                    initialValues={selectedProfile || undefined}
                    isEdit={!!selectedProfile}
                />
                {selectedProfile && (
                    <button
                        className="mt-2 text-gray-600 underline"
                        type="button"
                        onClick={() => setSelectedProfile(null)}
                    >
                        Cancelar edição
                    </button>
                )}
            </div>
        </div>
    );
}