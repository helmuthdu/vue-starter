import type { UserJSON } from './user.type';

export class User implements UserJSON {
  readonly email: string;
  readonly emailVerified: boolean;
  readonly id?: number;
  readonly password: string;
  readonly phoneNumber?: string;
  readonly phoneNumberVerified: boolean;
  readonly userName: string;
  readonly googleId?: string;
  readonly facebookId?: string;
  readonly token?: string;

  static create(user?: UserJSON) {
    return Object.assign({}, new User(), { ...(user ?? {}) }) as UserJSON;
  }
}
