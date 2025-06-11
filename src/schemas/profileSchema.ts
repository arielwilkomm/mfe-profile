import { z } from 'zod';

export const profileSchema = z.object({
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  name: z.string().min(1, 'Nome obrigatório').max(120),
  email: z.string().email('E-mail inválido').max(50),
  phone: z.string().min(10, 'Telefone deve ter entre 10 e 13 dígitos').max(13),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
