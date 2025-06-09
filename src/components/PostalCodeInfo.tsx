import React, { useState } from 'react';
import { getPostalCode } from '../api/bff';

export function PostalCodeInfo() {
    const [postalCode, setPostalCode] = useState('');
    const [info, setInfo] = useState<any>(null);

    const handleSearch = async () => {
        try {
            const data = await getPostalCode(postalCode);
            setInfo(data);
        } catch (e) {
            alert('Erro ao buscar postal code');
        }
    };

    return (
        <div className="mt-8">
            <input
                className="border p-2 mr-2"
                placeholder="Digite o CEP"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleSearch}>
                Buscar CEP
            </button>
            {info && (
                <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(info, null, 2)}</pre>
            )}
        </div>
    );
}