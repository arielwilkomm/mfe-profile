import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "../schemas/addressSchema";
import { useAddressApi } from "../hooks/useAddressApi";
import React, { useEffect } from "react";
import styled from "styled-components";

interface AddressFormProps {
    cpf: string;
    onSuccess?: () => void;
    initialValues?: AddressFormValues;
    isEdit?: boolean;
}

const Input = styled.input`
  border: 1px solid #d1d5db;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 1rem;
`;
const Select = styled.select`
  border: 1px solid #d1d5db;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 1rem;
`;
const ErrorMsg = styled.div`
  color: #dc2626;
  font-size: 0.95rem;
  margin-bottom: 8px;
`;
const InfoMsg = styled.div`
  color: #2563eb;
  font-size: 0.95rem;
  margin-bottom: 8px;
`;
const Button = styled.button`
  background: #16a34a;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #15803d;
  }
`;

export function AddressForm({ cpf, onSuccess, initialValues, isEdit }: AddressFormProps) {
    const { createAddress, updateAddress, getPostalCode } = useAddressApi();
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialValues || {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            addressType: 'RESIDENTIAL',
        },
    });

    // Atualiza os valores do formulário ao editar
    useEffect(() => {
        if (initialValues) {
            form.reset(initialValues);
        } else {
            form.reset({
                street: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
                addressType: 'RESIDENTIAL',
            });
        }
    }, [initialValues, form]);

    const onSubmit = async (data: AddressFormValues) => {
        if (isEdit && initialValues) {
            // O index do endereço será passado como string no onSubmit do AddressPage
            await updateAddress(cpf, initialValues.postalCode, data);
        } else {
            await createAddress(cpf, data);
        }
        form.reset();
        onSuccess?.();
    };

    const [autoFilled, setAutoFilled] = React.useState<{ [key: string]: boolean }>({
        street: false,
        city: false,
        state: false,
        country: false
    });
    const [cepEdited, setCepEdited] = React.useState(false);
    const [lastCep, setLastCep] = React.useState("");
    const [cepOnFocus, setCepOnFocus] = React.useState("");

    const handleCepFocus = () => {
        setCepOnFocus(form.getValues("postalCode"));
    };

    const handleCep = async () => {
        const cep = form.getValues("postalCode");
        const numericCep = cep.replace(/\D/g, "");
        if (cep !== lastCep && cep !== cepOnFocus && numericCep.length === 8) {
            setCepEdited(true);
            setLastCep(cep);
            const data = await getPostalCode(cep);
            form.setValue("street", data.logradouro || "");
            form.setValue("city", data.localidade || "");
            form.setValue("state", data.uf || "");
            form.setValue("country", data.estado || data.uf ? "Brasil" : "");
            setAutoFilled({
                street: !!data.logradouro && data.logradouro.trim() !== "",
                city: !!data.localidade && data.localidade.trim() !== "",
                state: !!data.uf && data.uf.trim() !== "",
                country: !!(data.estado && data.estado.trim() !== "" || data.uf && data.uf.trim() !== "")
            });
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
    const isFieldDisabled = (field: string) => {
        if (!isEdit && !cepEdited) return true;
        if (isEdit && !cepEdited) return true;
        return !!autoFilled[field];
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input
                {...form.register("postalCode")}
                placeholder="CEP"
                maxLength={9}
                onFocus={handleCepFocus}
                onBlur={handleCep}
                onChange={e => {
                    const masked = maskCep(e.target.value);
                    form.setValue("postalCode", masked);
                    if (isEdit || !isEdit) setCepEdited(false);
                }}
                value={form.watch("postalCode")}
            />
            {((isEdit && !cepEdited) || (!isEdit && !cepEdited)) && (
                <InfoMsg>Altere o CEP para liberar a edição dos outros campos.</InfoMsg>
            )}
            <Input
                {...form.register("street")}
                placeholder="Rua"
                disabled={isFieldDisabled("street")}
            />
            <Input
                {...form.register("city")}
                placeholder="Cidade"
                disabled={isFieldDisabled("city")}
            />
            <Input
                {...form.register("state")}
                placeholder="Estado"
                disabled={isFieldDisabled("state")}
            />
            <Input
                {...form.register("country")}
                placeholder="País"
                disabled={isFieldDisabled("country")}
            />
            <Select {...form.register("addressType")}
                disabled={isFieldDisabled("addressType")}
            >
                <option value="RESIDENTIAL">Residencial</option>
                <option value="COMMERCIAL">Comercial</option>
            </Select>
            {form.formState.errors && (
                <ErrorMsg>
                    {Object.values(form.formState.errors).map(e => e?.message).join(" | ")}
                </ErrorMsg>
            )}
            <Button type="submit" disabled={(!isEdit && !cepEdited) || (isEdit && !cepEdited)}>
                {isEdit ? "Atualizar" : "Salvar"}
            </Button>
        </form>
    );
}
