import type { UserJSON, UserRole } from '@/modules/user/models/user';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Permissions = Record<string, { action: PermissionAction; dataType?: Record<string, any> }>;

type PermissionCheck<Resource extends keyof Permissions> =
  | boolean
  | ((user: UserJSON, data: Permissions[Resource]['dataType']) => boolean);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<Record<PermissionAction, PermissionCheck<Key>>>;
  }>;
};

/**
 * Stores the dynamically registered permissions.
 */
const Roles: RolesWithPermissions = {} as RolesWithPermissions;

/**
 * Registers new permissions dynamically.
 *
 * @param role - The user role (e.g., 'admin', 'moderator').
 * @param resource - The resource name (e.g., 'user', 'post').
 * @param actions - A record defining which actions are allowed.
 */
export function registerPermissions<Resource extends string>(
  role: UserRole,
  resource: Resource,
  actions: Partial<Record<PermissionAction, PermissionCheck<Resource>>>,
): void {
  if (!Roles[role]) {
    Roles[role] = {};
  }

  if (!Roles[role]![resource]) {
    Roles[role]![resource] = {};
  }

  Object.assign(Roles[role]![resource]!, actions);
}

/**
 * Checks if a user has permission for a specific action on a resource.
 *
 * @param user - The user whose permissions are being checked.
 * @param resource - The resource being accessed.
 * @param action - The action being performed on the resource.
 * @param data - Optional data for validation.
 * @returns `true` if the user has permission, otherwise `false`.
 */
export function hasPermission<Resource extends string>(
  user: UserJSON,
  resource: Resource,
  action: PermissionAction,
  // biome-ignore lint/suspicious/noExplicitAny: -
  data?: Record<string, any>,
): boolean {
  return user.roles.some((role) => {
    const permission = Roles[role]?.[resource]?.[action];

    if (typeof permission === 'function' && data) {
      return permission(user, data);
    }

    return permission ?? false;
  });
}
