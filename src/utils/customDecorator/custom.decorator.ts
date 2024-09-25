import { SetMetadata } from '@nestjs/common';
import { validRoleId, validRoleType } from '../../user/entity/role.entity';

// Decorator for publicly accessible routes (no authentication required)
// Usage: @Public()
export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

// Existing Roles decorator (kept for backward compatibility)
// Usage: @Roles('role1', 'role2', ...)
export const ROLES_KEY = "roles";
export const Roles = (...roles: validRoleId[]) => SetMetadata(ROLES_KEY, roles);