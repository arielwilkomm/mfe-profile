import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Rua obrigatória').max(255),
  city: z.string().min(1, 'Cidade obrigatória').max(100),
  state: z.string().min(1, 'Estado obrigatório').max(100),
  country: z.string().min(1, 'País obrigatório').max(100),
  postalCode: z.string().min(1, 'CEP obrigatório').max(20),
  addressType: z.enum(['RESIDENTIAL', 'COMMERCIAL']),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
