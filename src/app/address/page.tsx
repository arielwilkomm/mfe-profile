"use client";

import { useCallback, useEffect, useState } from "react";
import { useAddressApi } from "../../hooks/useAddressApi";
import { AddressForm } from "../../components/AddressForm";
import { AddressFormValues } from "../../schemas/addressSchema";
import React from "react";
import * as S from "./styles";
import { Container } from "@/components/Container";

export default function AddressPage() {
    const { getAddresses, deleteAddress } = useAddressApi();
    const [cpf, setCpf] = useState("");
    const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
    const [error, setError] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<{ data: AddressFormValues; idx: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<{ idx: number; postalCode: string } | null>(null);

    const fetchAddresses = useCallback(async (cpfValue: string) => {
        try {
            const data = await getAddresses(cpfValue);
            setAddresses(Array.isArray(data) ? data : []);
        } catch {
            setError("Erro ao buscar endereços");
        }
    }, [getAddresses]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cpfParam = urlParams.get("cpf") || "";
        if (!cpfParam) {
            window.location.replace("/");
            return;
        }
        setCpf(cpfParam);
        fetchAddresses(cpfParam);
    }, [fetchAddresses]);

    const handleDelete = (addr: AddressFormValues, idx: number) => {
        setAddressToDelete({ idx, postalCode: addr.postalCode });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (addressToDelete !== null) {
            await deleteAddress(cpf, addressToDelete.postalCode);
            setAddressToDelete(null);
            setShowDeleteModal(false);
            fetchAddresses(cpf);
        }
    };

    const cancelDelete = () => {
        setAddressToDelete(null);
        setShowDeleteModal(false);
    };

    const handleEdit = (addr: AddressFormValues, idx: number) => {
        setSelectedAddress({ data: addr, idx });
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedAddress(null);
        setShowModal(true);
    };

    const handleFormSuccess = () => {
        setSelectedAddress(null);
        setShowModal(false);
        fetchAddresses(cpf);
    };

    return (
        <Container>
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
        </Container>
    );
}