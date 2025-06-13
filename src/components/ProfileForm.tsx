import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../schemas/profileSchema";
import { useProfileApi } from "../hooks/useProfileApi";
import React from "react";
import styled from "styled-components";

const Input = styled.input`
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input {...form.register("cpf")}
                placeholder="CPF" disabled={isEdit} />
            <Input {...form.register("name")}
                placeholder="Nome" />
            <Input {...form.register("email")}
                placeholder="Email" />
            <Input {...form.register("phone")}
                placeholder="Telefone" />
            {form.formState.errors && (
                <ErrorMsg>
                    {Object.values(form.formState.errors).map(e => e?.message).join(" | ")}
                </ErrorMsg>
            )}
            <Button type="submit">
                {isEdit ? "Atualizar" : "Salvar"}
            </Button>
        </form>
    );
}