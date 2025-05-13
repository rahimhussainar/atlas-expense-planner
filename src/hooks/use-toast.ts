
import { useState, useEffect } from 'react';
import { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function generateId() {
  return (++count).toString();
}

// Singleton to manage toast state
const toastState = {
  toasts: [] as ToasterToast[],
  listeners: new Set<(toasts: ToasterToast[]) => void>(),
  
  subscribe(listener: (toasts: ToasterToast[]) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
  
  dispatch(action: any) {
    switch (action.type) {
      case actionTypes.ADD_TOAST:
        this.toasts = [action.toast, ...this.toasts].slice(0, TOAST_LIMIT);
        break;
      
      case actionTypes.UPDATE_TOAST:
        this.toasts = this.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        );
        break;
      
      case actionTypes.DISMISS_TOAST:
        this.toasts = this.toasts.map((t) =>
          t.id === action.toastId || (action.toastId === undefined && !t.open)
            ? { ...t, open: false }
            : t
        );
        break;
      
      case actionTypes.REMOVE_TOAST:
        if (action.toastId === undefined) {
          this.toasts = this.toasts.filter((t) => t.open);
        } else {
          this.toasts = this.toasts.filter((t) => t.id !== action.toastId);
        }
        break;
    }
    
    this.listeners.forEach((listener) => {
      listener(this.toasts);
    });
  },
};

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>(toastState.toasts);

  useEffect(() => {
    return toastState.subscribe(setToasts);
  }, []);

  function toast({ ...props }: Omit<ToasterToast, "id">) {
    const id = generateId();

    const update = (props: Omit<ToasterToast, "id">) => {
      toastState.dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props, id },
      });
    };

    const dismiss = () => {
      toastState.dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId: id,
      });
    };

    toastState.dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) dismiss();
        },
      },
    });

    return {
      id,
      dismiss,
      update,
    };
  }

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      toastState.dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId,
      });
    },
  };
}

export const toast = (props: Omit<ToasterToast, "id">) => {
  return {
    ...props,
    dismiss: () => {},
    update: () => {},
  };
};
