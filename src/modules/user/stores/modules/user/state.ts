export interface State {
  username: string;
  email: string;
  isLoggedIn: boolean;
  token: string;
}

export const initialState = {
  username: '',
  email: '',
  isLoggedIn: false,
  token: ''
};

export const name = 'user';

export const state = (): State => ({ ...initialState });
