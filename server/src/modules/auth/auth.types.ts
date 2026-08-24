/** Auth HTTP DTOs + session principal. Persisted user row: `src/types/user.ts`. */

export interface LoginBody {
  email: string;
  password: string;
}

/** Authenticated caller (JWT), not the `users` table. */
export interface AuthUser {
  email: string;
  role: "admin";
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}
