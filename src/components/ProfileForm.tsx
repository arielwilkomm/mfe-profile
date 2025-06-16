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
        // Garante que addresses será enviado corretamente
        const addresses = enderecosAdicionados.length > 0 ? enderecosAdicionados : [novoEndereco];
        const payload = {
            cpf: data.cpf,
            name: data.name,
            email: data.email,
            phone: data.phone,
            addresses: addresses.map(addr => ({
                addressType: addr.addressType,
                street: addr.street,
                city: addr.city,
                state: addr.state,
                country: addr.country,
                postalCode: addr.postalCode
            }))
        };
        form.setValue('addresses', addresses, { shouldValidate: true });
        const valid = await form.trigger();
        if (!valid || addresses.length === 0) return;
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
        <S.FormContainer>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <S.TableProfile>
                        <S.TheadProfile>
                            <tr>
                                <S.ThProfile>CEP</S.ThProfile>
                                <S.ThProfile>Rua</S.ThProfile>
                                <S.ThProfile>Cidade</S.ThProfile>
                                <S.ThProfile>Estado</S.ThProfile>
                                <S.ThProfile>País</S.ThProfile>
                                <S.ThProfile>Tipo</S.ThProfile>
                                <S.ThProfile>Ações</S.ThProfile>
                            </tr>
                        </S.TheadProfile>
                        <tbody>
                            {enderecosAdicionados.map((end, idx) => (
                                <S.TableRowProfile key={idx} even={idx % 2 === 0}>
                                    <S.TdProfile>{end.postalCode}</S.TdProfile>
                                    <S.TdProfile>{end.street}</S.TdProfile>
                                    <S.TdProfile>{end.city}</S.TdProfile>
                                    <S.TdProfile>{end.state}</S.TdProfile>
                                    <S.TdProfile>{end.country}</S.TdProfile>
                                    <S.TdProfile>{end.addressType}</S.TdProfile>
                                    <S.ActionTdProfile>
                                        <S.Button type="button" variant="danger" onClick={() => handleRemoveEndereco(idx)}>
                                            Remover
                                        </S.Button>
                                    </S.ActionTdProfile>
                                </S.TableRowProfile>
                            ))}
                        </tbody>
                    </S.TableProfile>
                )}
                {/* Formulário de endereço para adicionar */}
                <S.AddressFormWrapper>
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
                    <S.Select
                        value={novoEndereco.addressType}
                        onChange={e => setNovoEndereco({ ...novoEndereco, addressType: e.target.value as 'RESIDENTIAL' | 'COMMERCIAL' })}
                    >
                        <option value="RESIDENTIAL">Residencial</option>
                        <option value="COMMERCIAL">Comercial</option>
                    </S.Select>
                    <S.Button type="button" variant="primary" onClick={handleAddEndereco}>
                        + Adicionar endereço
                    </S.Button>
                    {erroEndereco && (
                        <S.ErrorMsg>{erroEndereco}</S.ErrorMsg>
                    )}
                </S.AddressFormWrapper>
                <S.FormActions>
                    <S.Button type="submit" variant="primary" disabled={enderecosAdicionados.length === 0 || !form.formState.isValid}>
                        {isEdit ? "Atualizar" : "Salvar"}
                    </S.Button>
                </S.FormActions>
            </form>
        </S.FormContainer>
    );
}