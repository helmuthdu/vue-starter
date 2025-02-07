export type NotificationMessage = {
  message: string;
  read?: boolean;
  timeout?: number;
  translate?: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
};
