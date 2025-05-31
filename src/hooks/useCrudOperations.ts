import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseCrudOperationsProps<T> {
  onRefresh?: () => void;
}

export function useCrudOperations<T extends { id: string }>({ onRefresh }: UseCrudOperationsProps<T> = {}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [itemToEdit, setItemToEdit] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openAddForm = () => {
    setItemToEdit(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (item: T) => {
    setItemToEdit(item);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setItemToEdit(null);
    setFormMode('add');
  };

  const handleDelete = (item: T) => {
    setItemToDelete(item);
  };

  const confirmDelete = async (deleteFunction: (item: T) => Promise<void>, successMessage?: string) => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteFunction(itemToDelete);
      toast({ 
        title: 'Success', 
        description: successMessage || 'Item deleted successfully.' 
      });
      setItemToDelete(null);
      onRefresh?.();
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to delete item.', 
        variant: 'destructive' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const handleSubmit = async (
    submitFunction: (data: any) => Promise<void>,
    successMessage?: string
  ) => {
    setIsLoading(true);
    try {
      await submitFunction(itemToEdit);
      toast({ 
        title: 'Success', 
        description: successMessage || (formMode === 'edit' ? 'Item updated successfully.' : 'Item created successfully.')
      });
      closeForm();
      onRefresh?.();
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to save item.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    itemToDelete,
    itemToEdit,
    isDeleting,
    formMode,
    isFormOpen,
    openAddForm,
    openEditForm,
    closeForm,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleSubmit,
    setIsFormOpen,
  };
} 