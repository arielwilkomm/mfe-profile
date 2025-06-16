"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import { useProfileApi } from "../../hooks/useProfileApi";
import { ProfileForm } from "../../components/ProfileForm";
import { ProfileFormValues } from "../../schemas/profileSchema";
import React from "react";
import * as S from "./styles";

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
        <S.containerTableProfile>
            <S.HeaderProfile>
                <div style={{ flex: 1 }} />
                <S.TitleProfile>Perfis de Usuário</S.TitleProfile>
                <S.FlexEnd />
            </S.HeaderProfile>
            <S.TopBarProfile>
                <S.ErrorMsg>{error}</S.ErrorMsg>
                <S.Button variant="primary" onClick={handleCreate}>Criar usuário</S.Button>
            </S.TopBarProfile>
            <S.TableWrapperProfile>
                <S.TableProfile>
                    <S.TheadProfile>
                        <tr>
                            <S.ThProfile>Nome</S.ThProfile>
                            <S.ThProfile>CPF</S.ThProfile>
                            <S.ThProfile>Email</S.ThProfile>
                            <S.ThProfile>Telefone</S.ThProfile>
                            <S.ThProfile>Endereços</S.ThProfile>
                            <S.ThProfile>Ações</S.ThProfile>
                        </tr>
                    </S.TheadProfile>
                    <tbody>
                        {profiles.length === 0 ? (
                            <tr>
                                <S.TdProfileEmpty colSpan={6}>
                                    Nenhum perfil encontrado
                                </S.TdProfileEmpty>
                            </tr>
                        ) : (
                            profiles.map((profile, idx) => (
                                <S.TableRowProfile key={profile.cpf} even={idx % 2 === 0}>
                                    <S.TdProfile>{profile.name}</S.TdProfile>
                                    <S.TdProfile>{profile.cpf}</S.TdProfile>
                                    <S.TdProfile>{profile.email}</S.TdProfile>
                                    <S.TdProfile>{profile.phone}</S.TdProfile>
                                    <S.TdProfile>
                                        <S.LinkProfile href={`/address?cpf=${profile.cpf}`}>Ir para endereços</S.LinkProfile>
                                    </S.TdProfile>
                                    <S.ActionTdProfile>
                                        <S.Button variant="warning" onClick={() => handleEdit(profile)}>
                                            Alterar
                                        </S.Button>
                                        <S.Button variant="danger" onClick={() => handleDelete(profile.cpf)}>
                                            Excluir
                                        </S.Button>
                                    </S.ActionTdProfile>
                                </S.TableRowProfile>
                            ))
                        )}
                    </tbody>
                </S.TableProfile>
            </S.TableWrapperProfile>
            {/* Modal */}
            {showModal && (
                <S.ModalBgProfile>
                    <S.ModalProfile>
                        <S.CloseButtonProfile onClick={() => setShowModal(false)}>×</S.CloseButtonProfile>
                        <S.ModalTitle>{selectedProfile ? "Editar perfil" : "Criar novo perfil"}</S.ModalTitle>
                        <ProfileForm
                            onSuccess={handleFormSuccess}
                            initialValues={
                                selectedProfile
                                    ? { ...selectedProfile, addresses: selectedProfile.addresses ?? [] }
                                    : undefined
                            }
                            isEdit={!!selectedProfile}
                        />
                    </S.ModalProfile>
                </S.ModalBgProfile>
            )}
            {/* Modal de confirmação de exclusão */}
            {showDeleteModal && (
                <S.ModalBgProfile>
                    <S.ModalProfile>
                        <S.ModalTitleDelete>Deseja realmente excluir este usuário?</S.ModalTitleDelete>
                        <S.ModalActions>
                            <S.Button variant="neutral" onClick={cancelDelete}>Cancelar</S.Button>
                            <S.Button variant="danger" onClick={confirmDelete}>OK</S.Button>
                        </S.ModalActions>
                    </S.ModalProfile>
                </S.ModalBgProfile>
            )}
        </S.containerTableProfile>
    );
}