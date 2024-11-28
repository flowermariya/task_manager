import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    console.log('Payload for JWT:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const { email, password } = createAuthDto
      const user = await this.userService.findUserByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      throw error
    }
  }
}
