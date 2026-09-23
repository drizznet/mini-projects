export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: AuthUser;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    refreshToken?: string;
    refresh_token?: string;
    user?: AuthUser;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type CurrentUserResponse =
  | AuthUser
  | { user: AuthUser }
  | { data: AuthUser | { user: AuthUser } };
