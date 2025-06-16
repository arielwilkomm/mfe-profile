import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormValues } from '../schemas/addressSchema';
import { useAddressApi } from '../hooks/useAddressApi';

interface AddressFormProps {
  cpf: string;
  onSuccess?: () => void;
  initialValues?: AddressFormValues;
  isEdit?: boolean;
}

export function useAddressForm({ cpf, onSuccess, initialValues, isEdit }: AddressFormProps) {
  const { createAddress, updateAddress, getPostalCode } = useAddressApi();
  const form = useForm<{ addresses: AddressFormValues[] }>({
    resolver: async (values, context, options) => {
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
      addresses: [
        initialValues || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          addressType: 'RESIDENTIAL',
        },
      ],
    },
  });
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({ addresses: [initialValues] });
    } else {
      form.reset({
        addresses: [
          {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            addressType: 'RESIDENTIAL',
          },
        ],
      });
    }
  }, [initialValues, form]);

  const onSubmit = async (data: { addresses: AddressFormValues[] }) => {
    for (const addr of data.addresses) {
      if (isEdit && initialValues) {
        await updateAddress(cpf, initialValues.postalCode, addr);
      } else {
        await createAddress(cpf, addr);
      }
    }
    form.reset();
    onSuccess?.();
  };

  const [autoFilled, setAutoFilled] = useState<{ [idx: number]: { [key: string]: boolean } }>({});
  const [cepEdited, setCepEdited] = useState<{ [idx: number]: boolean }>({});
  const [lastCep, setLastCep] = useState<{ [idx: number]: string }>({});
  const [cepOnFocus, setCepOnFocus] = useState<{ [idx: number]: string }>({});

  const handleCepFocus = (idx: number) => {
    setCepOnFocus(prev => ({ ...prev, [idx]: form.getValues(`addresses.${idx}.postalCode`) }));
  };

  const handleCep = async (idx: number) => {
    const cep = form.getValues(`addresses.${idx}.postalCode`);
    const numericCep = cep.replace(/\D/g, '');
    if (cep !== lastCep[idx] && cep !== cepOnFocus[idx] && numericCep.length === 8) {
      setCepEdited(prev => ({ ...prev, [idx]: true }));
      setLastCep(prev => ({ ...prev, [idx]: cep }));
      const data = await getPostalCode(cep);
      form.setValue(`addresses.${idx}.street`, data.logradouro || '');
      form.setValue(`addresses.${idx}.city`, data.localidade || '');
      form.setValue(`addresses.${idx}.state`, data.uf || '');
      form.setValue(`addresses.${idx}.country`, data.estado || data.uf ? 'Brasil' : '');
      setAutoFilled(prev => ({
        ...prev,
        [idx]: {
          street: !!data.logradouro && data.logradouro.trim() !== '',
          city: !!data.localidade && data.localidade.trim() !== '',
          state: !!data.uf && data.uf.trim() !== '',
          country: !!(
            (data.estado && data.estado.trim() !== '') ||
            (data.uf && data.uf.trim() !== '')
          ),
        },
      }));
    }
  };

  const maskCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const isFieldDisabled = (field: string, idx: number) => {
    if (!isEdit && !cepEdited[idx]) return true;
    if (isEdit && !cepEdited[idx]) return true;
    return !!autoFilled[idx]?.[field];
  };

  return {
    form,
    fields,
    append,
    onSubmit,
    autoFilled,
    cepEdited,
    lastCep,
    cepOnFocus,
    handleCepFocus,
    handleCep,
    maskCep,
    isFieldDisabled,
    isEdit,
  };
}
