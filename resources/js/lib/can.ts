import { usePage } from '@inertiajs/react';

export function can(permission: string): boolean {
  const { auth } = usePage<{ auth: { user: { permissions?: string[] } } }>().props;

  if (!auth?.user?.permissions || !Array.isArray(auth.user.permissions)) {
    return false;
  }

  return auth.user.permissions.includes(permission);
}