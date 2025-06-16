import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '../schemas/profileSchema';
import { addressSchema, AddressFormValues } from '../schemas/addressSchema';
import { useProfileApi } from '../hooks/useProfileApi';

interface ProfileFormFull extends ProfileFormValues {
  addresses: AddressFormValues[];
}

export function useProfileForm({
  initialValues,
  isEdit,
  onSuccess,
}: {
  initialValues?: ProfileFormFull;
  isEdit?: boolean;
  onSuccess?: () => void;
}) {
  const { createProfile, updateProfile } = useProfileApi();
  const form = useForm<ProfileFormFull>({
    resolver: zodResolver(
      profileSchema.extend({
        addresses: addressSchema.array().min(1, 'Adicione pelo menos um endereço'),
      })
    ),
    defaultValues: initialValues || {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      addresses: [],
    },
    mode: 'onChange',
  });

  const [enderecosAdicionados, setEnderecosAdicionados] = useState<AddressFormValues[]>(
    initialValues?.addresses ?? []
  );
  const [novoEndereco, setNovoEndereco] = useState<AddressFormValues>({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    addressType: 'RESIDENTIAL',
  });
  const [erroEndereco, setErroEndereco] = useState<string | null>(null);
  const [focusCep, setFocusCep] = useState(false);

  // Estado para liberar campos de endereço após CEP válido
  const [cepLiberado, setCepLiberado] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<{
    [K in keyof AddressFormValues]?: boolean;
  }>({});
  const [cepEditedNovo, setCepEditedNovo] = useState(false);

  const handleAddEndereco = () => {
    const valid = addressSchema.safeParse(novoEndereco);
    if (!valid.success) {
      setErroEndereco('Preencha todos os campos obrigatórios do endereço.');
      return;
    }
    setEnderecosAdicionados([...enderecosAdicionados, novoEndereco]);
    setNovoEndereco({
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      addressType: 'RESIDENTIAL',
    });
    setErroEndereco(null);
    setFocusCep(true);
  };

  const handleRemoveEndereco = (idx: number) => {
    setEnderecosAdicionados(enderecosAdicionados.filter((_, i) => i !== idx));
  };

  const handleCep = async (cep: string) => {
    const numericCep = cep.replace(/\D/g, '');
    if (numericCep.length === 8) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/postal-code/${numericCep}`);
      if (res.ok) {
        const data = await res.json();
        setNovoEndereco(prev => ({
          ...prev,
          street: data.logradouro || '',
          city: data.localidade || '',
          state: data.uf || '',
          country: data.estado || data.uf ? 'Brasil' : '',
        }));
      }
    }
  };

  // Função para preencher campos via endpoint e marcar como auto preenchido
  const handleCepProfile = async (cep: string) => {
    await handleCep(cep);
    if (cep.replace(/\D/g, '').length === 8) {
      setCepLiberado(true);
    }
    setAutoFilledFields({
      street: !!novoEndereco.street,
      city: !!novoEndereco.city,
      state: !!novoEndereco.state,
      country: !!novoEndereco.country,
      postalCode: true,
      addressType: false,
    });
    setCepEditedNovo(true);
  };

  // Função para liberar edição de um campo se o usuário alterar manualmente
  const handleManualChange = (field: keyof AddressFormValues, value: string) => {
    setNovoEndereco({ ...novoEndereco, [field]: value });
    if (autoFilledFields[field]) {
      setAutoFilledFields({ ...autoFilledFields, [field]: false });
    }
  };

  const maskCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const onSubmit = async (data: ProfileFormFull) => {
    const addresses = enderecosAdicionados.length > 0 ? enderecosAdicionados : [novoEndereco];
    const payload = {
      cpf: data.cpf,
      name: data.name,
      email: data.email,
      phone: data.phone,
      addresses: addresses.map(addr => ({
        addressType: addr.addressType,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        postalCode: addr.postalCode,
      })),
    };
    form.setValue('addresses', addresses, { shouldValidate: true });
    const valid = await form.trigger();
    if (!valid || addresses.length === 0) return;
    if (isEdit && initialValues) {
      await updateProfile(payload.cpf, payload);
    } else {
      await createProfile(payload);
    }
    form.reset();
    setEnderecosAdicionados([]);
    onSuccess?.();
  };

  return {
    form,
    enderecosAdicionados,
    setEnderecosAdicionados,
    novoEndereco,
    setNovoEndereco,
    erroEndereco,
    setErroEndereco,
    focusCep,
    setFocusCep,
    handleAddEndereco,
    handleRemoveEndereco,
    handleCep,
    handleCepProfile,
    handleManualChange,
    maskCep,
    onSubmit,
    isEdit,
    cepLiberado,
    setCepLiberado,
    autoFilledFields,
    setAutoFilledFields,
    cepEditedNovo,
    setCepEditedNovo,
  };
}
