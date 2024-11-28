import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('requiredRoles', requiredRoles); // Debugging log

        if (!requiredRoles) {
            return true; // No roles specified, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('request.user', user); // Debugging log

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return true; // Access granted
    }
}
