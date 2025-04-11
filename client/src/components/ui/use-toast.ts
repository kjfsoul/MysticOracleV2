import { useState } from 'react';

type ToastVariant = 'default' | 'destructive';

interface Toast {
  title: string;
  description: string;
  variant?: ToastVariant;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (toastData: Toast) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 5000);
  };

  return {
    toast,
    showToast,
  };
}
