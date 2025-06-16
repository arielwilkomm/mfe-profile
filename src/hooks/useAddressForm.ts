import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
    resolver: async values => {
      const errors: { addresses: Record<string, string[]>[] } = { addresses: [] };
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
  const { fields } = useFieldArray({
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

  const [cepEdited, setCepEdited] = useState<{ [idx: number]: boolean }>({});
  const [lastCep, setLastCep] = useState<{ [idx: number]: string }>({});

  const handleCep = async (idx: number) => {
    const cep = form.getValues(`addresses.${idx}.postalCode`);
    const numericCep = cep.replace(/\D/g, '');
    if (cep !== lastCep[idx] && numericCep.length === 8) {
      setCepEdited(prev => ({ ...prev, [idx]: true }));
      setLastCep(prev => ({ ...prev, [idx]: cep }));
      const data = await getPostalCode(cep);
      form.setValue(`addresses.${idx}.street`, data.logradouro || '');
      form.setValue(`addresses.${idx}.city`, data.localidade || '');
      form.setValue(`addresses.${idx}.state`, data.uf || '');
      form.setValue(`addresses.${idx}.country`, data.estado || data.uf ? 'Brasil' : '');
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
    return false;
  };

  return {
    form,
    fields,
    onSubmit,
    cepEdited,
    lastCep,
    handleCep,
    maskCep,
    isFieldDisabled,
    isEdit,
  };
}
