import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      console.log(isMatch);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      address: user.address,
      state: user.state,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, pass: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pass, saltOrRounds);
    const user = await this.usersService.create(email, hash);
    const { passwordHash, ...result } = user;
    return result;
  }
}
