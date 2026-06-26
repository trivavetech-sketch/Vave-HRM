import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  tenantId: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /** Hash a plain-text password */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** Compare plain password against stored hash */
  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  /** Issue a signed JWT */
  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  /** Verify and decode a JWT */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
