export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  userId: string;
  avatarUrl: string | null;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser extends LoginUser {
  profile: UserProfile | null;
}

export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: LoginUser;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    refreshToken?: string;
    refresh_token?: string;
    user?: LoginUser;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface MeResponse {
  user: CurrentUser;
}
