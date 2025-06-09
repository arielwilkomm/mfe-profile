import React, { useState } from 'react';
import { getProfile } from '../api/bff';

export function ProfileInfo() {
    const [cpf, setCpf] = useState('');
    const [profile, setProfile] = useState<any>(null);

    const handleSearch = async () => {
        try {
            const data = await getProfile(cpf);
            setProfile(data);
        } catch (e) {
            alert('Erro ao buscar perfil');
        }
    };

    return (
        <div>
            <input
                className="border p-2 mr-2"
                placeholder="Digite o CPF"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSearch}>
                Buscar Perfil
            </button>
            {profile && (
                <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(profile, null, 2)}</pre>
            )}
        </div>
    );
}