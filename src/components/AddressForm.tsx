import React from "react";
import { useAddressForm } from "../hooks/useAddressForm";
import * as S from "./AddressForm/styles";
import { AddressFormValues } from "@/schemas/addressSchema";

interface AddressFormProps {
    cpf: string;
    onSuccess?: () => void;
    initialValues?: AddressFormValues;
    isEdit?: boolean;
}

export function AddressForm({ cpf, onSuccess, initialValues, isEdit }: AddressFormProps) {
    const {
        form,
        fields,
        onSubmit,
        handleCep,
        maskCep,
        isFieldDisabled,
        cepEdited,
    } = useAddressForm({ cpf, onSuccess, initialValues, isEdit });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, idx) => (
                <div key={field.id} style={{ marginBottom: 24, borderBottom: idx < fields.length - 1 ? '1px solid #eee' : 'none', paddingBottom: 16 }}>
                    <S.Input
                        {...form.register(`addresses.${idx}.postalCode`)}
                        placeholder="CEP"
                        maxLength={9}
                        onBlur={() => handleCep(idx)}
                        onChange={e => {
                            const masked = maskCep(e.target.value);
                            form.setValue(`addresses.${idx}.postalCode`, masked);
                            if (masked.replace(/\D/g, "").length === 8) {
                                handleCep(idx);
                            }
                        }}
                        value={form.watch(`addresses.${idx}.postalCode`)}
                    />
                    {((isEdit && !cepEdited[idx]) || (!isEdit && !cepEdited[idx])) && (
                        <S.InfoMsg>Altere o CEP para liberar a edição dos outros campos.</S.InfoMsg>
                    )}
                    <S.Input
                        {...form.register(`addresses.${idx}.street`)}
                        placeholder="Rua"
                        disabled={isFieldDisabled("street", idx)}
                    />
                    <S.Input
                        {...form.register(`addresses.${idx}.city`)}
                        placeholder="Cidade"
                        disabled={isFieldDisabled("city", idx)}
                    />
                    <S.Input
                        {...form.register(`addresses.${idx}.state`)}
                        placeholder="Estado"
                        disabled={isFieldDisabled("state", idx)}
                    />
                    <S.Input
                        {...form.register(`addresses.${idx}.country`)}
                        placeholder="País"
                        disabled={isFieldDisabled("country", idx)}
                    />
                    <S.Select {...form.register(`addresses.${idx}.addressType`)}
                        disabled={isFieldDisabled("addressType", idx)}
                    >
                        <option value="RESIDENTIAL">Residencial</option>
                        <option value="COMMERCIAL">Comercial</option>
                    </S.Select>
                    {form.formState.errors?.addresses?.[idx] && (
                        <S.ErrorMsg>
                            {Object.values(form.formState.errors.addresses[idx] as Record<string, string[]>).flat().join(' | ')}
                        </S.ErrorMsg>
                    )}
                </div>
            ))}
            <S.Button type="submit" disabled={!form.formState.isValid}>
                Salvar
            </S.Button>
        </form>
    );
}
