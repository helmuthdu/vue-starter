import type { UserJSON, UserRole } from './user.type';

export class User implements UserJSON {
  readonly email: string;
  readonly emailVerified: boolean;
  readonly facebookId?: string;
  readonly googleId?: string;
  readonly id?: number;
  readonly newsletter?: boolean;
  readonly password: string;
  readonly phoneNumber?: string;
  readonly phoneNumberVerified: boolean;
  readonly roles: UserRole[];
  readonly token?: string;
  readonly userName: string;

  static create(user?: UserJSON) {
    return Object.assign({}, new User(), { ...(user ?? {}) }) as UserJSON;
  }
}
