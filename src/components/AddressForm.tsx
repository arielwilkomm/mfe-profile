import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "../schemas/addressSchema";
import { useAddressApi } from "../hooks/useAddressApi";
import React, { useEffect } from "react";

interface AddressFormProps {
    cpf: string;
    onSuccess?: () => void;
    initialValues?: AddressFormValues;
    isEdit?: boolean;
}

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <input
                {...form.register("postalCode")}
                className="border p-2 w-full"
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
                <div className="text-blue-600 text-sm mb-2">Altere o CEP para liberar a edição dos outros campos.</div>
            )}
            <input
                {...form.register("street")}
                className="border p-2 w-full" placeholder="Rua"
                disabled={isFieldDisabled("street")}
            />
            <input
                {...form.register("city")}
                className="border p-2 w-full" placeholder="Cidade"
                disabled={isFieldDisabled("city")}
            />
            <input
                {...form.register("state")}
                className="border p-2 w-full" placeholder="Estado"
                disabled={isFieldDisabled("state")}
            />
            <input
                {...form.register("country")}
                className="border p-2 w-full" placeholder="País"
                disabled={isFieldDisabled("country")}
            />
            <select {...form.register("addressType")}
                className="border p-2 w-full"
                disabled={isFieldDisabled("addressType")}
            >
                <option value="RESIDENTIAL">Residencial</option>
                <option value="COMMERCIAL">Comercial</option>
            </select>
            {form.formState.errors && (
                <div className="text-red-500 text-sm">
                    {Object.values(form.formState.errors).map(e => e?.message).join(" | ")}
                </div>
            )}
            <button type="submit" className="bg-green-500 text-white px-4 py-2" disabled={(!isEdit && !cepEdited) || (isEdit && !cepEdited)}>
                {isEdit ? "Atualizar" : "Salvar"}
            </button>
        </form>
    );
}
