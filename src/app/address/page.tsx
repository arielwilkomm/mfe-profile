'use client';

import { useEffect, useState } from 'react';
import { createAddress, getAddress, getAllAddresses, getPostalCode, AddressRecordDTO } from './addressService';

export default function AddressPage() {
    const [cpf, setCpf] = useState('');
    const [addressId, setAddressId] = useState('');
    const [address, setAddress] = useState<AddressRecordDTO | null>(null);
    const [form, setForm] = useState<AddressRecordDTO>({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        addressType: 'RESIDENCIAL',
    });
    const [error, setError] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);
    const [addresses, setAddresses] = useState<AddressRecordDTO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cpfParam = urlParams.get('cpf') || '';
        setCpf(cpfParam);
        if (cpfParam) {
            setLoading(true);
            getAllAddresses(cpfParam)
                .then(data => setAddresses(Array.isArray(data) ? data : []))
                .catch(e => setError('Erro ao buscar endereços'))
                .finally(() => setLoading(false));
        }
    }, []);

    const handleGet = async () => {
        setError('');
        try {
            const data = await getAddress(cpf, addressId);
            setAddress(data);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleCreate = async () => {
        setError('');
        try {
            const data = await createAddress(cpf, form);
            setAddress(data);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleCepSearch = async () => {
        setLoadingCep(true);
        try {
            const data = await getPostalCode(form.postalCode);
            setForm(f => ({
                ...f,
                street: data.logradouro || f.street,
                city: data.localidade || f.city,
                state: data.uf || f.state,
                country: 'Brasil',
            }));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingCep(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
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
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.length === 0 ? (
                            <tr>
                                <td className="border px-2 py-1 text-center" colSpan={6}>Nenhum endereço encontrado</td>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div className="mb-4">
                <h2 className="font-semibold">Criar novo endereço</h2>
                <div className="flex mb-2 w-full">
                    <input
                        className="border p-2 flex-1"
                        placeholder="CEP"
                        value={form.postalCode}
                        onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 ml-2"
                        type="button"
                        onClick={handleCepSearch}
                        disabled={loadingCep || !form.postalCode}
                    >
                        {loadingCep ? 'Buscando...' : 'Buscar CEP'}
                    </button>
                </div>
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Rua"
                    value={form.street}
                    onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Cidade"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Estado"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                />
                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="País"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                />
                <select
                    className="border p-2 mb-2 w-full"
                    value={form.addressType}
                    onChange={e =>
                        setForm(f => ({
                            ...f,
                            addressType: e.target.value as AddressRecordDTO['addressType'],
                        }))
                    }
                >
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMMERCIAL">Comercial</option>
                </select>
                <button className="bg-green-500 text-white px-4 py-2" onClick={handleCreate}>
                    Criar
                </button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {address && (
                <div className="mt-4 border p-4">
                    <h3 className="font-bold">Endereço retornado:</h3>
                    <pre>{JSON.stringify(address, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}