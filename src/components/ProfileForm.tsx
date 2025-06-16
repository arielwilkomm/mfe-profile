import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../schemas/profileSchema";
import { addressSchema, AddressFormValues } from "../schemas/addressSchema";
import { useProfileApi } from "../hooks/useProfileApi";
import * as S from "../app/profile/styles";
import * as AddressFormStyles from "../components/AddressForm/styles";

interface ProfileFormFull extends ProfileFormValues {
    addresses: AddressFormValues[];
}

export function ProfileForm({ onSuccess, initialValues, isEdit }: {
    onSuccess?: () => void;
    initialValues?: ProfileFormFull;
    isEdit?: boolean;
}) {
    const { createProfile, updateProfile } = useProfileApi();
    const form = useForm<ProfileFormFull>({
        resolver: zodResolver(
            profileSchema.extend({ addresses: addressSchema.array().min(1, 'Adicione pelo menos um endereço') })
        ),
        defaultValues: initialValues || {
            name: "",
            cpf: "",
            email: "",
            phone: "",
            addresses: [],
        },
        mode: 'onChange',
    });

    // Estado para endereços adicionados
    const [enderecosAdicionados, setEnderecosAdicionados] = useState<AddressFormValues[]>(initialValues?.addresses ?? []);
    const [novoEndereco, setNovoEndereco] = useState<AddressFormValues>({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        addressType: 'RESIDENTIAL',
    });
    const [erroEndereco, setErroEndereco] = useState<string | null>(null);
    const [focusCep, setFocusCep] = useState(false);

    // Função para adicionar endereço à lista
    const handleAddEndereco = () => {
        const valid = addressSchema.safeParse(novoEndereco);
        if (!valid.success) {
            setErroEndereco("Preencha todos os campos obrigatórios do endereço.");
            return;
        }
        setEnderecosAdicionados([...enderecosAdicionados, novoEndereco]);
        setNovoEndereco({
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            addressType: 'RESIDENTIAL',
        });
        setErroEndereco(null);
        setFocusCep(true);
    };

    // Função para remover endereço da lista
    const handleRemoveEndereco = (idx: number) => {
        setEnderecosAdicionados(enderecosAdicionados.filter((_, i) => i !== idx));
    };

    // Preenchimento automático de CEP para novo endereço
    const handleCep = async (cep: string) => {
        const numericCep = cep.replace(/\D/g, "");
        if (numericCep.length === 8) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/postal-code/${numericCep}`);
            if (res.ok) {
                const data = await res.json();
                setNovoEndereco(prev => ({
                    ...prev,
                    street: data.logradouro || '',
                    city: data.localidade || '',
                    state: data.uf || '',
                    country: data.estado || data.uf ? "Brasil" : '',
                }));
            }
        }
    };

    const maskCep = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{3})\d+?$/, "$1");
    };

    // Adaptar o submit para enviar todos os endereços
    const onSubmit = async (data: ProfileFormFull) => {
        // Sincroniza o array addresses do form antes de submeter
        const payload = { ...data, addresses: enderecosAdicionados };
        // Atualiza o form para garantir que addresses está correto
        form.setValue('addresses', enderecosAdicionados, { shouldValidate: true });
        const valid = await form.trigger();
        if (!valid || enderecosAdicionados.length === 0) return;
        if (isEdit && initialValues) {
            await updateProfile(payload.cpf, payload);
        } else {
            await createProfile(payload);
        }
        form.reset();
        setEnderecosAdicionados([]);
        onSuccess?.();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 32, maxWidth: 900, margin: '0 auto' }}>
            <S.ProfileFormGrid>
                <S.ProfileFormCol>
                    <S.Input {...form.register("cpf")} placeholder="CPF" disabled={isEdit} />
                </S.ProfileFormCol>
                <S.ProfileFormCol>
                    <S.Input {...form.register("name")} placeholder="Nome" />
                </S.ProfileFormCol>
                <S.ProfileFormCol>
                    <S.Input {...form.register("phone")} placeholder="Telefone" />
                </S.ProfileFormCol>
                <S.ProfileFormCol>
                    <S.Input {...form.register("email")} placeholder="Email" />
                </S.ProfileFormCol>
            </S.ProfileFormGrid>
            {/* Tabela de endereços adicionados */}
            {enderecosAdicionados.length > 0 && (
                <table style={{ width: '100%', marginBottom: 24, background: '#f9fafb', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <thead style={{ background: 'linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)' }}>
                        <tr>
                            <th style={{ padding: 12, textAlign: 'left' }}>CEP</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Rua</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Cidade</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>País</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Tipo</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enderecosAdicionados.map((end, idx) => (
                            <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f3f4f6' }}>
                                <td style={{ padding: 12 }}>{end.postalCode}</td>
                                <td style={{ padding: 12 }}>{end.street}</td>
                                <td style={{ padding: 12 }}>{end.city}</td>
                                <td style={{ padding: 12 }}>{end.state}</td>
                                <td style={{ padding: 12 }}>{end.country}</td>
                                <td style={{ padding: 12 }}>{end.addressType}</td>
                                <td style={{ padding: 12 }}>
                                    <button type="button" onClick={() => handleRemoveEndereco(idx)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>Remover</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Formulário de endereço para adicionar */}
            <div style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16, background: '#f9fafb', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 16 }}>
                <S.Input
                    placeholder="CEP"
                    maxLength={9}
                    value={novoEndereco.postalCode}
                    onChange={e => {
                        const masked = maskCep(e.target.value);
                        setNovoEndereco({ ...novoEndereco, postalCode: masked });
                    }}
                    onBlur={() => handleCep(novoEndereco.postalCode)}
                    ref={el => {
                        if (el && focusCep) {
                            el.focus();
                            setFocusCep(false);
                        }
                    }}
                />
                <S.Input
                    placeholder="Rua"
                    value={novoEndereco.street}
                    onChange={e => setNovoEndereco({ ...novoEndereco, street: e.target.value })}
                />
                <S.Input
                    placeholder="Cidade"
                    value={novoEndereco.city}
                    onChange={e => setNovoEndereco({ ...novoEndereco, city: e.target.value })}
                />
                <S.Input
                    placeholder="Estado"
                    value={novoEndereco.state}
                    onChange={e => setNovoEndereco({ ...novoEndereco, state: e.target.value })}
                />
                <S.Input
                    placeholder="País"
                    value={novoEndereco.country}
                    onChange={e => setNovoEndereco({ ...novoEndereco, country: e.target.value })}
                />
                <AddressFormStyles.Select
                    value={novoEndereco.addressType}
                    onChange={e => setNovoEndereco({ ...novoEndereco, addressType: e.target.value as 'RESIDENTIAL' | 'COMMERCIAL' })}
                >
                    <option value="RESIDENTIAL">Residencial</option>
                    <option value="COMMERCIAL">Comercial</option>
                </AddressFormStyles.Select>
                <button type="button" onClick={handleAddEndereco} style={{ marginTop: 8, marginBottom: 8, background: '#16a34a', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>
                    + Adicionar endereço
                </button>
                {erroEndereco && (
                    <S.ErrorMsg>{erroEndereco}</S.ErrorMsg>
                )}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
                <S.Button type="submit" variant="primary" disabled={enderecosAdicionados.length === 0 || !form.formState.isValid}>
                    {isEdit ? "Atualizar" : "Salvar"}
                </S.Button>
            </div>
        </form>
    );
}