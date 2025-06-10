'use client';

import { useState } from 'react';
import { createAddress, getAddress, getPostalCode, AddressRecordDTO } from './addressService';

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
            <h1 className="text-2xl font-bold mb-4">Endereço</h1>
            <div className="mb-4">
                <input
                    className="border p-2 mr-2"
                    placeholder="CPF"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                />
                <input
                    className="border p-2 mr-2"
                    placeholder="Address ID"
                    value={addressId}
                    onChange={e => setAddressId(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleGet}>
                    Buscar
                </button>
            </div>
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