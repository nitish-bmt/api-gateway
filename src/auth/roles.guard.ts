import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { validRoleId } from '../user/entity/role.entity';
import { ROLES_KEY } from '../utils/customDecorator/custom.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route

    const requiredRoles = this.reflector.getAllAndOverride<validRoleId[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }
    
    // Get the user from the request object
    const user = context.switchToHttp().getRequest().user;

    if(!user.roleId){
      console.log("user ahs no role assigned");
      return false;
    }

    // console.log(requiredRoles, "reqauth");
    // console.log(user.roleId, "avblauth");

    return requiredRoles.includes(user.roleId);

  }
}