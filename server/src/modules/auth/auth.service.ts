import { AppError } from "../../errors";
import { authRepository, type AuthRepository } from "./auth.repository";
import { verifyGoogleIdToken } from "./google";
import { hashPassword, verifyPassword } from "./password";
import { signToken, TOKEN_TTL_SEC, verifyToken } from "./token";
import type { AuthUser, LoginResponse, RegisterBody } from "./auth.types";

function toLoginUser(user: {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): LoginResponse["user"] {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const main = () => {}

function issueLogin(user: {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): LoginResponse {
  const token = signToken({
    sub: user.email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC,
  });
  return { token, user: toLoginUser(user) };
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  getUserFromToken(token: string): AuthUser {
    const payload = verifyToken(token);
    if (!payload) {
      throw new AppError(401, "Invalid or expired token");
    }
    console.log(payload)
    return { email: payload.sub, role: "admin" };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.passwordHarsh) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(
      user.passwordHarsh,
      password,
    );
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid password");
    }

    return issueLogin(user);
  }

  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const google = await verifyGoogleIdToken(idToken);

    const existingAccount = await this.authRepository.findGoogleAccount(
      google.sub,
    );
    if (existingAccount) {
      return issueLogin(existingAccount.user);
    }

    const existingUser = await this.authRepository.findByEmail(google.email);
    if (existingUser) {
      await this.authRepository.linkGoogleAccount(
        existingUser.id,
        google.sub,
      );
      return issueLogin(existingUser);
    }

    const created = await this.authRepository.createGoogleUser({
      email: google.email,
      providerAccountId: google.sub,
      displayName: google.name ?? null,
      avatarUrl: google.picture ?? null,
    });
    return issueLogin(created);
  }

  async register(payload: RegisterBody): Promise<void> {
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password;
    const displayName = payload.displayName?.trim() || null;
    const passwordHash = await hashPassword(password);

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(409, "User already exists");
    }

    await this.authRepository.create({
      email,
      passwordHash,
      displayName,
    });
  }

  async getUserProfile(email: string) {
    const user = await this.authRepository.findByEmailWithProfile(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

}

export const authService = new AuthService(authRepository);
