export interface State {
  username: string;
  email: string;
  isLoggedIn: boolean;
  token: string;
}

export const state = (): State => ({
  username: '',
  email: '',
  isLoggedIn: false,
  token: ''
});
