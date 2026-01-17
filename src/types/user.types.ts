export type UserRole = 'viewer' | 'contributor' | 'admin';

export interface User { role: UserRole; }

export interface RolePermissions {
  canViewIdeas: boolean; canViewCategories: boolean; canVote: boolean;
  canCreateIdeas: boolean; canComment: boolean; canManageIdeas: boolean;
  canManageCategories: boolean; canAccessAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  viewer: { canViewIdeas: true, canViewCategories: true, canVote: false, canCreateIdeas: false, canComment: false, canManageIdeas: false, canManageCategories: false, canAccessAdmin: false },
  contributor: { canViewIdeas: true, canViewCategories: true, canVote: true, canCreateIdeas: true, canComment: true, canManageIdeas: false, canManageCategories: false, canAccessAdmin: false },
  admin: { canViewIdeas: true, canViewCategories: true, canVote: true, canCreateIdeas: true, canComment: true, canManageIdeas: true, canManageCategories: true, canAccessAdmin: true },
};
