import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "../schemas/addressSchema";
import { useAddressApi } from "../hooks/useAddressApi";
import * as S from "./AddressForm/styles";

interface AddressFormProps {
    cpf: string;
    onSuccess?: () => void;
    initialValues?: AddressFormValues;
    isEdit?: boolean;
}

export function AddressForm({ cpf, onSuccess, initialValues, isEdit }: AddressFormProps) {
    const { createAddress, updateAddress, getPostalCode } = useAddressApi();
    const form = useForm<{ addresses: AddressFormValues[] }>({
        resolver: async (values, context, options) => {
            // Validação de todos os endereços
            const errors: any = { addresses: [] };
            let valid = true;
            for (let i = 0; i < values.addresses.length; i++) {
                const result = addressSchema.safeParse(values.addresses[i]);
                if (!result.success) {
                    errors.addresses[i] = result.error.flatten().fieldErrors;
                    valid = false;
                } else {
                    errors.addresses[i] = {};
                }
            }
            return {
                values: valid ? values : {},
                errors: valid ? {} : errors,
            };
        },
        defaultValues: {
            addresses: [initialValues || {
                street: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
                addressType: 'RESIDENTIAL',
            }],
        },
    });
    const { fields, append } = useFieldArray({
        control: form.control,
        name: "addresses",
    });

    // Atualiza os valores do formulário ao editar
    useEffect(() => {
        if (initialValues) {
            form.reset({
                addresses: [initialValues]
            });
        } else {
            form.reset({
                addresses: [{
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    postalCode: '',
                    addressType: 'RESIDENTIAL',
                }],
            });
        }
    }, [initialValues, form]);

    const onSubmit = async (data: { addresses: AddressFormValues[] }) => {
        for (const addr of data.addresses) {
            if (isEdit && initialValues) {
                // O index do endereço será passado como string no onSubmit do AddressPage
                await updateAddress(cpf, initialValues.postalCode, addr);
            } else {
                await createAddress(cpf, addr);
            }
        }
        form.reset();
        onSuccess?.();
    };

    // Estados para múltiplos endereços
    const [autoFilled, setAutoFilled] = React.useState<{ [idx: number]: { [key: string]: boolean } }>({});
    const [cepEdited, setCepEdited] = React.useState<{ [idx: number]: boolean }>({});
    const [lastCep, setLastCep] = React.useState<{ [idx: number]: string }>({});
    const [cepOnFocus, setCepOnFocus] = React.useState<{ [idx: number]: string }>({});

    const handleCepFocus = (idx: number) => {
        setCepOnFocus((prev) => ({ ...prev, [idx]: form.getValues(`addresses.${idx}.postalCode`) }));
    };

    const handleCep = async (idx: number) => {
        const cep = form.getValues(`addresses.${idx}.postalCode`);
        const numericCep = cep.replace(/\D/g, "");
        if (cep !== lastCep[idx] && cep !== cepOnFocus[idx] && numericCep.length === 8) {
            setCepEdited((prev) => ({ ...prev, [idx]: true }));
            setLastCep((prev) => ({ ...prev, [idx]: cep }));
            const data = await getPostalCode(cep);
            form.setValue(`addresses.${idx}.street`, data.logradouro || "");
            form.setValue(`addresses.${idx}.city`, data.localidade || "");
            form.setValue(`addresses.${idx}.state`, data.uf || "");
            form.setValue(`addresses.${idx}.country`, data.estado || data.uf ? "Brasil" : "");
            setAutoFilled((prev) => ({
                ...prev,
                [idx]: {
                    street: !!data.logradouro && data.logradouro.trim() !== "",
                    city: !!data.localidade && data.localidade.trim() !== "",
                    state: !!data.uf && data.uf.trim() !== "",
                    country: !!(data.estado && data.estado.trim() !== "" || data.uf && data.uf.trim() !== "")
                }
            }));
        }
    };

    // Função para aplicar máscara de CEP (00000-000)
    const maskCep = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{3})\d+?$/, "$1");
    };

    // Se for criação, só permite editar campos após buscar um CEP válido
    const isFieldDisabled = (field: string, idx: number) => {
        if (!isEdit && !cepEdited[idx]) return true;
        if (isEdit && !cepEdited[idx]) return true;
        return !!(autoFilled[idx]?.[field]);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, idx) => (
                <div key={field.id} style={{ marginBottom: 24, borderBottom: idx < fields.length - 1 ? '1px solid #eee' : 'none', paddingBottom: 16 }}>
                    <S.Input
                        {...form.register(`addresses.${idx}.postalCode`)}
                        placeholder="CEP"
                        maxLength={9}
                        onFocus={() => handleCepFocus(idx)}
                        onBlur={() => handleCep(idx)}
                        onChange={e => {
                            const masked = maskCep(e.target.value);
                            form.setValue(`addresses.${idx}.postalCode`, masked);
                            setCepEdited((prev) => ({ ...prev, [idx]: false }));
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
                            {Object.values(form.formState.errors.addresses[idx] as any).flat().join(' | ')}
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
