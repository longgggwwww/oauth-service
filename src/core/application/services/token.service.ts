import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub?: string; // userId (optional for client_credentials flow)
  email?: string;
  clientId: string;
  authorities?: string[];
  type?: 'user' | 'client_credentials';
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(private readonly jwtService: JwtService) {
    this.accessSecret =
      process.env.JWT_ACCESS_SECRET || 'access-secret-change-me';
    this.refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me';
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options = {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
    };
    return this.jwtService.sign({ ...payload } as any, options);
  }

  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options = {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
    };
    return this.jwtService.sign({ ...payload } as any, options);
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.accessSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.refreshSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }
}
