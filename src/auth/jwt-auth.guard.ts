import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        const req = context.switchToHttp().getRequest();
        console.log('Authorization Header:', req.headers.authorization); // Debugging log

        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized');
        }
        console.log('Authenticated User in JwtAuthGuard:', user); // Debugging log
        return user; // Attach user to request
    }

}
