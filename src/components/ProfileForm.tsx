import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../schemas/profileSchema";
import { useProfileApi } from "../hooks/useProfileApi";
import React from "react";

interface ProfileFormProps {
    onSuccess?: () => void;
    initialValues?: ProfileFormValues;
    isEdit?: boolean;
}

export function ProfileForm({ onSuccess, initialValues, isEdit }: ProfileFormProps) {
    const { createProfile, updateProfile } = useProfileApi();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: initialValues || { name: "", cpf: "", email: "", phone: "" },
    });

    // Atualiza os valores do formulário ao editar
    React.useEffect(() => {
        if (initialValues) {
            form.reset(initialValues);
        }
    }, [initialValues, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (isEdit && initialValues) {
            await updateProfile(data.cpf, data);
        } else {
            await createProfile(data);
        }
        form.reset();
        onSuccess?.();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <input {...form.register("cpf")}
                className="border p-2 w-full" placeholder="CPF" disabled={isEdit} />
            <input {...form.register("name")}
                className="border p-2 w-full" placeholder="Nome" />
            <input {...form.register("email")}
                className="border p-2 w-full" placeholder="Email" />
            <input {...form.register("phone")}
                className="border p-2 w-full" placeholder="Telefone" />
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