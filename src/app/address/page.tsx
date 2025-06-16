"use client";

import React from "react";
import { AddressForm } from "../../components/AddressForm";
import * as S from "./styles";
import { useAddressPage } from "./useAddressPage";

export default function AddressPage() {
    const {
        cpf,
        addresses,
        error,
        selectedAddress,
        showModal,
        showDeleteModal,
        setShowModal,
        handleDelete,
        confirmDelete,
        cancelDelete,
        handleEdit,
        handleCreate,
        handleFormSuccess,
    } = useAddressPage();

    return (
        <S.containerTable>
            <S.Button variant="back" onClick={() => window.history.back()} aria-label="Voltar">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path d="M13 16l-5-5 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </S.Button>
            <S.Header>
                <S.Title>Endereços do Usuário</S.Title>
            </S.Header>
            <S.TopBar>
                <S.ErrorMsg>{error}</S.ErrorMsg>
                <S.Button variant="primary" onClick={handleCreate}>Criar endereço</S.Button>
            </S.TopBar>
            <S.TableWrapper>
                <S.Table>
                    <S.Thead>
                        <tr>
                            <S.Th>Rua</S.Th>
                            <S.Th>Cidade</S.Th>
                            <S.Th>Estado</S.Th>
                            <S.Th>País</S.Th>
                            <S.Th>CEP</S.Th>
                            <S.Th>Tipo</S.Th>
                            <S.Th>Ações</S.Th>
                        </tr>
                    </S.Thead>
                    <tbody>
                        {addresses.length === 0 ? (
                            <tr>
                                <S.TdEmpty colSpan={7}>Nenhum endereço encontrado</S.TdEmpty>
                            </tr>
                        ) : (
                            addresses.map((addr, idx) => (
                                <S.TableRow key={idx} even={idx % 2 === 0}>
                                    <S.Td>{addr.street}</S.Td>
                                    <S.Td>{addr.city}</S.Td>
                                    <S.Td>{addr.state}</S.Td>
                                    <S.Td>{addr.country}</S.Td>
                                    <S.Td>{addr.postalCode}</S.Td>
                                    <S.Td>{addr.addressType}</S.Td>
                                    <S.ActionTd>
                                        <S.Button variant="warning" onClick={() => handleEdit(addr, idx)}>Alterar</S.Button>
                                        <S.Button variant="danger" onClick={() => handleDelete(addr, idx)}>Excluir</S.Button>
                                    </S.ActionTd>
                                </S.TableRow>
                            ))
                        )}
                    </tbody>
                </S.Table>
            </S.TableWrapper>
            {showModal && (
                <S.ModalBg>
                    <S.Modal>
                        <S.CloseButton onClick={() => setShowModal(false)}>×</S.CloseButton>
                        <S.ModalTitle>{selectedAddress ? 'Editar endereço' : 'Criar endereço'}</S.ModalTitle>
                        {cpf && (
                            <AddressForm
                                cpf={cpf}
                                onSuccess={handleFormSuccess}
                                initialValues={selectedAddress?.data}
                                isEdit={!!selectedAddress}
                            />
                        )}
                    </S.Modal>
                </S.ModalBg>
            )}
            {showDeleteModal && (
                <S.ModalBg>
                    <S.Modal>
                        <S.ModalTitleDelete>Deseja realmente excluir este endereço?</S.ModalTitleDelete>
                        <S.ModalActions>
                            <S.Button variant="neutral" onClick={cancelDelete}>Cancelar</S.Button>
                            <S.Button variant="danger" onClick={confirmDelete}>OK</S.Button>
                        </S.ModalActions>
                    </S.Modal>
                </S.ModalBg>
            )}
        </S.containerTable>
    );
}