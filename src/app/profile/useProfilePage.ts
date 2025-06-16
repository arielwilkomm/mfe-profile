import { useCallback, useEffect, useState } from 'react';
import { useProfileApi } from '../../hooks/useProfileApi';
import { ProfileFormValues } from '../../schemas/profileSchema';

export function useProfilePage() {
  const { getProfiles, deleteProfile } = useProfileApi();
  const [profiles, setProfiles] = useState<ProfileFormValues[]>([]);
  const [error, setError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileFormValues | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cpfToDelete, setCpfToDelete] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const data = await getProfiles();
      setProfiles(Array.isArray(data) ? data : []);
    } catch {
      setError('Erro ao buscar perfis');
    }
  }, [getProfiles]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleEdit = (profile: ProfileFormValues) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedProfile(null);
    setShowModal(true);
  };

  const handleDelete = (cpf: string) => {
    setCpfToDelete(cpf);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (cpfToDelete) {
      await deleteProfile(cpfToDelete);
      setCpfToDelete(null);
      setShowDeleteModal(false);
      fetchProfiles();
    }
  };

  const cancelDelete = () => {
    setCpfToDelete(null);
    setShowDeleteModal(false);
  };

  const handleFormSuccess = () => {
    setSelectedProfile(null);
    setShowModal(false);
    fetchProfiles();
  };

  return {
    profiles,
    error,
    selectedProfile,
    showModal,
    showDeleteModal,
    setShowModal,
    handleEdit,
    handleCreate,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleFormSuccess,
  };
}
