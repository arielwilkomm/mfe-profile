import { useCallback, useEffect, useState } from 'react';
import { useAddressApi } from '../../hooks/useAddressApi';
import { AddressFormValues } from '../../schemas/addressSchema';

export function useAddressPage() {
  const { getAddresses, deleteAddress } = useAddressApi();
  const [cpf, setCpf] = useState('');
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  const [error, setError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<{
    data: AddressFormValues;
    idx: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{
    idx: number;
    postalCode: string;
  } | null>(null);

  const fetchAddresses = useCallback(
    async (cpfValue: string) => {
      try {
        const data = await getAddresses(cpfValue);
        setAddresses(Array.isArray(data) ? data : []);
      } catch {
        setError('Erro ao buscar endereços');
      }
    },
    [getAddresses]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cpfParam = urlParams.get('cpf') || '';
    if (!cpfParam) {
      window.location.replace('/');
      return;
    }
    setCpf(cpfParam);
    fetchAddresses(cpfParam);
  }, [fetchAddresses]);

  const handleDelete = (addr: AddressFormValues, idx: number) => {
    setAddressToDelete({ idx, postalCode: addr.postalCode });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (addressToDelete !== null) {
      await deleteAddress(cpf, addressToDelete.postalCode);
      setAddressToDelete(null);
      setShowDeleteModal(false);
      fetchAddresses(cpf);
    }
  };

  const cancelDelete = () => {
    setAddressToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEdit = (addr: AddressFormValues, idx: number) => {
    setSelectedAddress({ data: addr, idx });
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedAddress(null);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setSelectedAddress(null);
    setShowModal(false);
    fetchAddresses(cpf);
  };

  return {
    cpf,
    addresses,
    error,
    selectedAddress,
    showModal,
    showDeleteModal,
    addressToDelete,
    setShowModal,
    setShowDeleteModal,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleEdit,
    handleCreate,
    handleFormSuccess,
  };
}
