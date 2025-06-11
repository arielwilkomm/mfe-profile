"use client";

import { useCallback, useEffect, useState } from "react";
import { useAddressApi } from "../../hooks/useAddressApi";
import { AddressForm } from "../../components/AddressForm";
import { AddressFormValues } from "../../schemas/addressSchema";

export default function AddressPage() {
    const { getAddresses, deleteAddress } = useAddressApi();
    const [cpf, setCpf] = useState("");
    const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<{ data: AddressFormValues; idx: number } | null>(null);

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

    const handleDelete = async (addr: AddressFormValues, idx: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este endereço?")) return;
        setError("");
        setLoading(true);
        try {
            await deleteAddress(cpf, idx.toString());
            fetchAddresses(cpf);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
            else setError("Erro desconhecido ao excluir endereço");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (addr: AddressFormValues, idx: number) => {
        setSelectedAddress({ data: addr, idx });
    };

    const handleFormSuccess = () => {
        setSelectedAddress(null);
        fetchAddresses(cpf);
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <button
                className="mb-4 text-blue-600 underline"
                type="button"
                onClick={() => window.history.back()}
            >
                ← Voltar
            </button>
            <h1 className="text-2xl font-bold mb-4">Endereços do Usuário</h1>
            {loading ? (
                <div>Carregando...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Rua</th>
                            <th className="border px-2 py-1">Cidade</th>
                            <th className="border px-2 py-1">Estado</th>
                            <th className="border px-2 py-1">País</th>
                            <th className="border px-2 py-1">CEP</th>
                            <th className="border px-2 py-1">Tipo</th>
                            <th className="border px-2 py-1">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.length === 0 ? (
                            <tr>
                                <td className="border px-2 py-1 text-center" colSpan={7}>Nenhum endereço encontrado</td>
                            </tr>
                        ) : (
                            addresses.map((addr, idx) => (
                                <tr key={idx}>
                                    <td className="border px-2 py-1">{addr.street}</td>
                                    <td className="border px-2 py-1">{addr.city}</td>
                                    <td className="border px-2 py-1">{addr.state}</td>
                                    <td className="border px-2 py-1">{addr.country}</td>
                                    <td className="border px-2 py-1">{addr.postalCode}</td>
                                    <td className="border px-2 py-1">{addr.addressType}</td>
                                    <td className="border px-2 py-1">
                                        <button className="text-red-600 underline" type="button" onClick={() => handleDelete(addr, idx)}>Excluir</button>
                                        <button className="ml-2 text-yellow-600 underline" type="button" onClick={() => handleEdit(addr, idx)}>Alterar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div className="mb-4">
                <h2 className="font-semibold">{selectedAddress ? "Editar endereço" : "Criar novo endereço"}</h2>
                {cpf && (
                    <AddressForm
                        cpf={cpf}
                        onSuccess={handleFormSuccess}
                        initialValues={selectedAddress?.data}
                        isEdit={!!selectedAddress}
                    />
                )}
                {selectedAddress && (
                    <button
                        className="mt-2 text-gray-600 underline"
                        type="button"
                        onClick={() => setSelectedAddress(null)}
                    >
                        Cancelar edição
                    </button>
                )}
            </div>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
}