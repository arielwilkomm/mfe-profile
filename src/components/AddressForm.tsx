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

    const handleCep = async () => {
        const cep = form.getValues("postalCode");
        if (cep) {
            const data = await getPostalCode(cep);
            form.setValue("street", data.logradouro || "");
            form.setValue("city", data.localidade || "");
            form.setValue("state", data.uf || "");
            form.setValue("country", "Brasil");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex gap-2">
                <input {...form.register("postalCode")}
                    className="border p-2 flex-1" placeholder="CEP" />
                <button type="button" className="bg-blue-500 text-white px-2" onClick={handleCep}>Buscar CEP</button>
            </div>
            <input {...form.register("street")}
                className="border p-2 w-full" placeholder="Rua" />
            <input {...form.register("city")}
                className="border p-2 w-full" placeholder="Cidade" />
            <input {...form.register("state")}
                className="border p-2 w-full" placeholder="Estado" />
            <input {...form.register("country")}
                className="border p-2 w-full" placeholder="País" />
            <select {...form.register("addressType")}
                className="border p-2 w-full">
                <option value="RESIDENTIAL">Residencial</option>
                <option value="COMMERCIAL">Comercial</option>
            </select>
            {form.formState.errors && (
                <div className="text-red-500 text-sm">
                    {Object.values(form.formState.errors).map(e => e?.message).join(" | ")}
                </div>
            )}
            <button type="submit" className="bg-green-500 text-white px-4 py-2">
                {isEdit ? "Atualizar" : "Salvar"}
            </button>
        </form>
    );
}
