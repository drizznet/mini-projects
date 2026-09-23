/** Auth HTTP DTOs and repository inputs. */

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  displayName?: string | null;
}

export interface GoogleLoginBody {
  /**
   * Google ID token from the frontend Sign-In button.
   * @minLength 1
   */
  idToken: string;
}

/** Repository create input — password already hashed. Not the HTTP body. */
export interface AuthCreateInput {
  email: string;
  passwordHash?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

/** Authenticated caller (JWT), not the `users` table. */
export interface AuthUser {
  email: string;
  role: "admin";
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface UserProfile {
  userId: string;
  avatarUrl: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfiledUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfile | null;
}

export interface MeResponse {
  user: ProfiledUser;
}
