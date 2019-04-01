export interface State {
  username: string;
  email: string;
  isLogged: boolean;
  token: string;
}

export const state = (): State => ({
  username: '',
  email: '',
  isLogged: false,
  token: ''
});
