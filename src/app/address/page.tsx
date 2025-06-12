"use client";

import { useCallback, useEffect, useState } from "react";
import { useAddressApi } from "../../hooks/useAddressApi";
import { AddressForm } from "../../components/AddressForm";
import { AddressFormValues } from "../../schemas/addressSchema";
import React from "react";

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
        <div className="max-w-3xl mx-auto p-2 sm:p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
                <button
                    className="text-blue-600 underline self-start"
                    type="button"
                    onClick={() => window.history.back()}
                >
                    ← Voltar
                </button>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    onClick={handleCreate}
                >
                    Criar endereço
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Endereços do Usuário</h1>
            {loading ? (
                <div>Carregando...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="w-full overflow-x-auto flex justify-center">
                    <table className="min-w-[600px] w-full bg-white rounded-xl shadow-lg border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                <th className="border-b px-4 py-3 text-left font-semibold">Rua</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Cidade</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Estado</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">País</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">CEP</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Tipo</th>
                                <th className="border-b px-4 py-3 text-left font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-2 text-center text-gray-500" colSpan={7}>Nenhum endereço encontrado</td>
                                </tr>
                            ) : (
                                addresses.map((addr, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="px-4 py-2 border-b">{addr.street}</td>
                                        <td className="px-4 py-2 border-b">{addr.city}</td>
                                        <td className="px-4 py-2 border-b">{addr.state}</td>
                                        <td className="px-4 py-2 border-b">{addr.country}</td>
                                        <td className="px-4 py-2 border-b">{addr.postalCode}</td>
                                        <td className="px-4 py-2 border-b">{addr.addressType}</td>
                                        <td className="px-4 py-2 border-b">
                                            <button className="text-yellow-600 underline hover:text-yellow-800" type="button" onClick={() => handleEdit(addr, idx)}>Alterar</button>
                                            <button className="ml-2 text-red-600 underline hover:text-red-800" type="button" onClick={() => handleDelete(addr, idx)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
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
                        <h2 className="font-semibold mb-2">{selectedAddress ? "Editar endereço" : "Criar novo endereço"}</h2>
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
            {/* Modal de confirmação de exclusão */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                        <h2 className="font-semibold mb-4">Deseja realmente excluir este endereço?</h2>
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
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
}