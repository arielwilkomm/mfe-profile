"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import { useProfileApi } from "../../hooks/useProfileApi";
import { ProfileForm } from "../../components/ProfileForm";
import { ProfileFormValues } from "../../schemas/profileSchema";
import React from "react";
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
  background: ${({ color }) => color || '#2563eb'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ color }) => color === '#2563eb' ? '#1d4ed8' : color === '#d97706' ? '#b45309' : color === '#dc2626' ? '#b91c1c' : color};
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
  background: linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%);
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
const Link = styled.a`
  color: #2563eb;
  text-decoration: underline;
  &:hover {
    color: #1d4ed8;
  }
`;

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
            <Header>
                <div style={{ flex: 1 }} />
                <Title>Perfis de Usuário</Title>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCreate}>Criar usuário</Button>
                </div>
            </Header>
            {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
            <div style={{ width: '100%', overflowX: 'auto', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                <Table>
                    <Thead>
                        <tr>
                            <Th>Nome</Th>
                            <Th>CPF</Th>
                            <Th>Email</Th>
                            <Th>Telefone</Th>
                            <Th>Endereços</Th>
                            <Th>Ações</Th>
                        </tr>
                    </Thead>
                    <tbody>
                        {profiles.length === 0 ? (
                            <tr>
                                <Td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>
                                    Nenhum perfil encontrado
                                </Td>
                            </tr>
                        ) : (
                            profiles.map((profile, idx) => (
                                <tr key={profile.cpf} style={{ background: idx % 2 === 0 ? '#f9fafb' : '#fff' }}>
                                    <Td>{profile.name}</Td>
                                    <Td>{profile.cpf}</Td>
                                    <Td>{profile.email}</Td>
                                    <Td>{profile.phone}</Td>
                                    <Td>
                                        <Link href={`/address?cpf=${profile.cpf}`}>Ir para endereços</Link>
                                    </Td>
                                    <Td style={{ whiteSpace: 'nowrap' }}>
                                        <Button color="#d97706" style={{ marginRight: 8, background: 'none', color: '#d97706', textDecoration: 'underline', boxShadow: 'none', padding: 0 }} onClick={() => handleEdit(profile)}>
                                            Alterar
                                        </Button>
                                        <Button color="#dc2626" style={{ background: 'none', color: '#dc2626', textDecoration: 'underline', boxShadow: 'none', padding: 0 }} onClick={() => handleDelete(profile.cpf)}>
                                            Excluir
                                        </Button>
                                    </Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
            {/* Modal */}
            {showModal && (
                <ModalBg>
                    <Modal style={{ maxWidth: 480 }}>
                        <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
                        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>{selectedProfile ? "Editar perfil" : "Criar novo perfil"}</h2>
                        <ProfileForm
                            onSuccess={handleFormSuccess}
                            initialValues={selectedProfile || undefined}
                            isEdit={!!selectedProfile}
                        />
                    </Modal>
                </ModalBg>
            )}
            {/* Modal de confirmação de exclusão */}
            {showDeleteModal && (
                <ModalBg>
                    <Modal style={{ maxWidth: 400 }}>
                        <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Deseja realmente excluir este usuário?</h2>
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