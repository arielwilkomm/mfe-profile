import React, { useState } from 'react';
import { getAddresses } from '../api/bff';

export function AddressInfo() {
    const [cpf, setCpf] = useState('');
    const [addresses, setAddresses] = useState<any>(null);

    const handleSearch = async () => {
        try {
            const data = await getAddresses(cpf);
            setAddresses(data);
        } catch (e) {
            alert('Erro ao buscar endereços');
        }
    };

    return (
        <div className="mt-8">
            <input
                className="border p-2 mr-2"
                placeholder="Digite o CPF"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSearch}>
                Buscar Endereços
            </button>
            {addresses && (
                <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(addresses, null, 2)}</pre>
            )}
        </div>
    );
}