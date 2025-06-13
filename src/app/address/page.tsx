"use client";

import { useCallback, useEffect, useState } from "react";
import { useAddressApi } from "../../hooks/useAddressApi";
import { AddressForm } from "../../components/AddressForm";
import { AddressFormValues } from "../../schemas/addressSchema";
import React from "react";
import { Container } from "@/components/Container";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;
const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
`;
const Button = styled.button<{ color?: string }>`
  min-width: 140px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: ${({ color }) => color || '#16a34a'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ color }) => color === '#16a34a' ? '#15803d' : color === '#d97706' ? '#b45309' : color === '#dc2626' ? '#b91c1c' : color};
  }
`;
const Table = styled.table`
  min-width: 700px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  overflow: hidden;
`;
const Thead = styled.thead`
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
`;
const Th = styled.th`
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
`;
const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
`;
const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  padding: 32px 24px 24px 24px;
  width: 100%;
  max-width: 400px;
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
`;

export default function AddressPage() {
    const { getAddresses, deleteAddress } = useAddressApi();
    const [cpf, setCpf] = useState("");
    const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<{ data: AddressFormValues; idx: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<{ idx: number; postalCode: string } | null>(null);

    const fetchAddresses = useCallback(async (cpfValue: string) => {
        setLoading(true);
        try {
            const data = await getAddresses(cpfValue);
            setAddresses(Array.isArray(data) ? data : []);
        } catch {
            setError("Erro ao buscar endereços");
        } finally {
            setLoading(false);
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
            <Header>
                <Button color="#2563eb" style={{ background: 'none', color: '#2563eb', textDecoration: 'underline', boxShadow: 'none', padding: 0 }} onClick={() => window.history.back()}>
                    ← Voltar
                </Button>
                <Title>Endereços do Usuário</Title>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCreate}>Criar endereço</Button>
                </div>
            </Header>
            {loading ? (
                <div>Carregando...</div>
            ) : error ? (
                <div style={{ color: '#dc2626' }}>{error}</div>
            ) : (
                <div style={{ width: '100%', overflowX: 'auto', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Rua</Th>
                                <Th>Cidade</Th>
                                <Th>Estado</Th>
                                <Th>País</Th>
                                <Th>CEP</Th>
                                <Th>Tipo</Th>
                                <Th>Ações</Th>
                            </tr>
                        </Thead>
                        <tbody>
                            {addresses.length === 0 ? (
                                <tr>
                                    <Td colSpan={7} style={{ textAlign: 'center', color: '#6b7280' }}>Nenhum endereço encontrado</Td>
                                </tr>
                            ) : (
                                addresses.map((addr, idx) => (
                                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#f9fafb' : '#fff' }}>
                                        <Td>{addr.street}</Td>
                                        <Td>{addr.city}</Td>
                                        <Td>{addr.state}</Td>
                                        <Td>{addr.country}</Td>
                                        <Td>{addr.postalCode}</Td>
                                        <Td>{addr.addressType}</Td>
                                        <Td style={{ whiteSpace: 'nowrap' }}>
                                            <Button color="#d97706" style={{ marginRight: 8, background: 'none', color: '#d97706', textDecoration: 'underline', boxShadow: 'none', padding: 0 }} onClick={() => handleEdit(addr, idx)}>Alterar</Button>
                                            <Button color="#dc2626" style={{ background: 'none', color: '#dc2626', textDecoration: 'underline', boxShadow: 'none', padding: 0 }} onClick={() => handleDelete(addr, idx)}>Excluir</Button>
                                        </Td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
            {showModal && (
                <ModalBg>
                    <Modal style={{ maxWidth: 480 }}>
                        <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
                        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>{selectedAddress ? 'Editar endereço' : 'Criar endereço'}</h2>
                        {cpf && (
                            <AddressForm
                                cpf={cpf}
                                onSuccess={handleFormSuccess}
                                initialValues={selectedAddress?.data}
                                isEdit={!!selectedAddress}
                            />
                        )}
                    </Modal>
                </ModalBg>
            )}
            {showDeleteModal && (
                <ModalBg>
                    <Modal style={{ maxWidth: 400 }}>
                        <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Deseja realmente excluir este endereço?</h2>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <Button color="#6b7280" style={{ background: '#e5e7eb', color: '#111827' }} onClick={cancelDelete}>Cancelar</Button>
                            <Button color="#dc2626" onClick={confirmDelete}>OK</Button>
                        </div>
                    </Modal>
                </ModalBg>
            )}
        </Container>
    );
}