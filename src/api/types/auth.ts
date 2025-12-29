export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_at: number;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface JwtPayload {
  user_id: string;
  username: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}
