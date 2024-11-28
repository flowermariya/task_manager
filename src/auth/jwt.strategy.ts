import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'fallbackSecret',
        });
    }

    async validate(payload: any) {
        console.log('Payload for JWT:', payload); // Debugging log
        const user = { userId: payload.sub, email: payload.email, role: payload.role };
        console.log('User in JwtStrategy:', user); // Debugging log
        return user; // Attach this user to request.user
    }
    
}
