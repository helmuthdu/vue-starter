export type UserSchema = {
  email: string;
  emailVerified?: boolean;
  id?: number;
  password?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  newsletter?: boolean;
  token?: string;
  userName?: string;
  googleId?: string;
  facebookId?: string;
};
