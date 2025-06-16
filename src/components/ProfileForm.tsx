import React from "react";
import { ProfileFormValues } from "../schemas/profileSchema";
import { AddressFormValues } from "../schemas/addressSchema";
import { useProfileForm } from "../hooks/useProfileForm";
import * as S from "../app/profile/styles";

interface ProfileFormFull extends ProfileFormValues {
    addresses: AddressFormValues[];
}

export function ProfileForm({ onSuccess, initialValues, isEdit, showAddressFields, onToggleAddressFields }: {
    onSuccess?: () => void;
    initialValues?: ProfileFormFull;
    isEdit?: boolean;
    showAddressFields?: boolean;
    onToggleAddressFields?: () => void;
}) {
    const {
        form,
        enderecosAdicionados,
        setNovoEndereco,
        novoEndereco,
        erroEndereco,
        focusCep,
        setFocusCep,
        handleAddEndereco,
        handleRemoveEndereco,
        handleCep,
        maskCep,
        onSubmit,
    } = useProfileForm({ initialValues, isEdit, onSuccess });

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
                {showAddressFields && (
                    <>
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
                        <S.ProfileFormGrid>
                            <S.ProfileFormCol>
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
                                    disabled={false}
                                />
                            </S.ProfileFormCol>
                            <S.ProfileFormCol>
                                <S.Input
                                    placeholder="Rua"
                                    value={novoEndereco.street}
                                    onChange={e => setNovoEndereco({ ...novoEndereco, street: e.target.value })}
                                    disabled={false}
                                />
                            </S.ProfileFormCol>
                            <S.ProfileFormCol>
                                <S.Input
                                    placeholder="Cidade"
                                    value={novoEndereco.city}
                                    onChange={e => setNovoEndereco({ ...novoEndereco, city: e.target.value })}
                                    disabled={false}
                                />
                            </S.ProfileFormCol>
                            <S.ProfileFormCol>
                                <S.Input
                                    placeholder="Estado"
                                    value={novoEndereco.state}
                                    onChange={e => setNovoEndereco({ ...novoEndereco, state: e.target.value })}
                                    disabled={false}
                                />
                            </S.ProfileFormCol>
                            <S.ProfileFormCol>
                                <S.Input
                                    placeholder="País"
                                    value={novoEndereco.country}
                                    onChange={e => setNovoEndereco({ ...novoEndereco, country: e.target.value })}
                                    disabled={false}
                                />
                            </S.ProfileFormCol>
                            <S.ProfileFormCol>
                                <S.Select
                                    value={novoEndereco.addressType}
                                    onChange={e => setNovoEndereco({ ...novoEndereco, addressType: e.target.value as 'RESIDENTIAL' | 'COMMERCIAL' })}
                                    disabled={false}
                                >
                                    <option value="RESIDENTIAL">Residencial</option>
                                    <option value="COMMERCIAL">Comercial</option>
                                </S.Select>
                            </S.ProfileFormCol>
                            <S.ProfileFormCol style={{ gridColumn: '1 / -1' }}>
                                <S.Button type="button" variant="primary" onClick={handleAddEndereco}>
                                    + Adicionar endereço
                                </S.Button>
                                {erroEndereco && (
                                    <S.ErrorMsg>{erroEndereco}</S.ErrorMsg>
                                )}
                            </S.ProfileFormCol>
                        </S.ProfileFormGrid>
                    </>
                )}
                <S.FormActions>
                    <S.Button
                        type="button"
                        variant="warning"
                        onClick={onToggleAddressFields}
                        style={{ marginRight: 8 }}
                    >
                        {showAddressFields ? "Ocultar Endereço" : "Adicionar/Editar Endereço"}
                    </S.Button>
                    <S.Button type="submit" variant="primary" disabled={enderecosAdicionados.length === 0 || !form.formState.isValid}>
                        {isEdit ? "Atualizar" : "Salvar"}
                    </S.Button>
                </S.FormActions>
            </form>
        </S.FormContainer>
    );
}