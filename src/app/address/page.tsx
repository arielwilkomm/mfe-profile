"use client";

import { useCallback, useEffect, useState } from "react";
import { useAddressApi } from "../../hooks/useAddressApi";
import { AddressForm } from "../../components/AddressForm";
import { AddressFormValues } from "../../schemas/addressSchema";
import React from "react";
import { Container } from "@/components/Container";

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
            <div className="max-w-5xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <button className="text-blue-600 underline hover:text-blue-800" onClick={() => window.history.back()}>
                        ← Voltar
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-1">Endereços do Usuário</h1>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        onClick={handleCreate}
                    >
                        Criar endereço
                    </button>
                </div>

                {loading ? (
                    <div>Carregando...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-gray-300 rounded text-[15px]">
                            <thead className="bg-gray-100 text-gray-700 font-medium">
                                <tr>
                                    <th className="px-4 py-2 text-left">Rua</th>
                                    <th className="px-4 py-2 text-left">Cidade</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">País</th>
                                    <th className="px-4 py-2 text-left">CEP</th>
                                    <th className="px-4 py-2 text-left">Tipo</th>
                                    <th className="px-4 py-2 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addresses.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-2 text-center text-gray-500" colSpan={7}>Nenhum endereço encontrado</td>
                                    </tr>
                                ) : (
                                    addresses.map((addr, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-4 py-2 border-t">{addr.street}</td>
                                            <td className="px-4 py-2 border-t">{addr.city}</td>
                                            <td className="px-4 py-2 border-t">{addr.state}</td>
                                            <td className="px-4 py-2 border-t">{addr.country}</td>
                                            <td className="px-4 py-2 border-t">{addr.postalCode}</td>
                                            <td className="px-4 py-2 border-t">{addr.addressType}</td>
                                            <td className="px-4 py-2 border-t whitespace-nowrap">
                                                <button className="text-yellow-600 hover:text-yellow-800 mr-4" onClick={() => handleEdit(addr, idx)}>Alterar</button>
                                                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(addr, idx)}>Excluir</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
                            <button className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>×</button>
                            <h2 className="text-lg font-semibold mb-4">{selectedAddress ? 'Editar endereço' : 'Criar endereço'}</h2>
                            {cpf && (
                                <AddressForm
                                    cpf={cpf}
                                    onSuccess={handleFormSuccess}
                                    initialValues={selectedAddress?.data}
                                    isEdit={!!selectedAddress}
                                />
                            )}
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
                            <h2 className="text-lg font-semibold mb-4">Deseja realmente excluir este endereço?</h2>
                            <div className="flex justify-end gap-2">
                                <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={cancelDelete}>Cancelar</button>
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={confirmDelete}>OK</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}