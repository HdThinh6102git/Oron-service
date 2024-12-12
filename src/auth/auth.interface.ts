import { RoleOutput } from '@modules/auth/dtos';

export interface JwtPayload {
  id: string;
  username: string;
  role: RoleOutput;
}

export interface Payload {
  id: string;
  username: string;
  role: RoleOutput;
}

export interface RefreshTokenPayload {
  sub: string;
}
