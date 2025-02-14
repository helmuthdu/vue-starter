import type { UserJSON, UserRole } from '@/modules/user/models/user';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

// biome-ignore lint/suspicious/noExplicitAny: -
export type Permissions = Record<string, { action: PermissionAction; dataType?: Record<string, any> }>;

/**
 * Defines a permission check function or a boolean.
 */
type PermissionCheck<Resource extends keyof Permissions> =
  | boolean
  | ((user: UserJSON, data: Permissions[Resource]['dataType']) => boolean);

/**
 * Represents the permissions assigned to each user role.
 *
 * - Each role maps to a set of resources.
 * - Each resource maps to a set of actions (`view`, `create`, etc.).
 * - Each action is either `true` (granted), `false` (denied),
 *   or a function that determines access dynamically.
 */
type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<Record<PermissionAction, PermissionCheck<Key>>>;
  }>;
};

/**
 * Stores the dynamically registered permissions for each role.
 *
 * @remarks
 * This object is updated by {@link registerPermissions} and read by {@link hasPermission}.
 */
const Roles: RolesWithPermissions = {} as RolesWithPermissions;

/**
 * Registers new permissions dynamically for a specific role and resource.
 *
 * @example
 * // Admin has full control over users
 * registerPermissions('admin', 'user', {
 *   view: true,
 *   create: true,
 *   update: true,
 *   delete: true,
 * });
 *
 * // Moderators can update users only if it's themselves
 * registerPermissions('moderator', 'user', {
 *   view: true,
 *   update: (user, data) => user.id === data.userId,
 * });
 *
 * // Regular users can only view their own data
 * registerPermissions('user', 'user', {
 *   view: (user, data) => user.id === data.userId,
 * });
 *
 * @template Resource - The name of the resource being registered.
 * @param {UserRole} role - The user role (e.g., 'admin', 'moderator').
 * @param {Resource} resource - The resource name (e.g., 'user', 'post').
 * @param {Partial<Record<PermissionAction, PermissionCheck<Resource>>>} actions - A record defining which actions are allowed.
 */
export function registerPermissions<Resource extends string>(
  role: UserRole,
  resource: Resource,
  actions: Partial<Record<PermissionAction, PermissionCheck<Resource>>>,
): void {
  Roles[role] ||= {};
  Roles[role][resource] ||= {};

  Object.assign(Roles[role][resource], actions);
}

/**
 * Checks if a user has permission for a specific action on a resource.
 *
 * @example
 * // Check if a moderator can update a user profile (e.g. user = { id: 1, roles: ['moderator'] })
 * const canUpdate = hasPermission(user, 'user', 'update', { userId: 123 });
 *
 * // Check if an admin can delete a post (e.g. user = { id: 1, roles: ['admin'] })
 * const canDelete = hasPermission(user, 'post', 'delete');
 *
 * @template Resource - The name of the resource being accessed.
 * @param {UserJSON} user - The user whose permissions are being checked.
 * @param {Resource} resource - The resource being accessed.
 * @param {PermissionAction} action - The action being performed on the resource.
 * @param {Record<string, any>} [data] - Optional data to validate dynamic permission checks.
 *
 * @returns {boolean} `true` if the user has permission, otherwise `false`.
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
