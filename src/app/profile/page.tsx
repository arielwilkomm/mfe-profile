"use client";

import React from "react";
import { ProfileForm } from "../../components/ProfileForm";
import * as S from "./styles";
import { useProfilePage } from "./useProfilePage";

export default function ProfilePage() {
    const {
        profiles,
        error,
        selectedProfile,
        showModal,
        showDeleteModal,
        setShowModal,
        handleEdit,
        handleCreate,
        handleDelete,
        confirmDelete,
        cancelDelete,
        handleFormSuccess,
    } = useProfilePage();

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