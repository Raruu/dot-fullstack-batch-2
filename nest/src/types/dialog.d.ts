import { ReactNode } from 'react';

export interface UseConfirmDialogOptions {
  title: string;
  message: ReactNode | (() => ReactNode);
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  noCancle?: boolean;
  isDismissable?: boolean;
  variant?: 'primary' | 'danger' | 'warning' | 'success';
}

export interface UseConfirmDialogFixedOptions {
  title: string;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  noCancle?: boolean;
  isDismissable?: boolean;
  variant?: 'primary' | 'danger' | 'warning' | 'success';
}
