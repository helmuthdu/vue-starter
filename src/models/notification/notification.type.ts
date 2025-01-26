export type MessageJSON = {
  message: string;
  read?: boolean;
  timeout?: number;
  translate?: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
};
