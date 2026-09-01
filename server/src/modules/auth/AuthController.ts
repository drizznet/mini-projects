/**
 * Auth HTTP surface. DTOs in `auth.types.ts`.
 *
 * @example
 * POST /api/auth/login { "email": "admin@drizznet.local", "password": "drizznet" }
 */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import type { Request as ExpressRequest } from "express";
import { authService } from "./auth.service";
import type { LoginBody, RegisterBody, LoginResponse, MeResponse, GoogleLoginBody } from "./auth.types";

@Route("api/auth")
@Tags("Auth")
export class AuthController extends Controller {

  @Post("login")
  @SuccessResponse(200, "Logged in")
    login(@Body() body: LoginBody): Promise<LoginResponse> {
    return authService.login(body.email, body.password);
  }

  @Post("google")
  @SuccessResponse(200, "Logged in with Google")
  async google(@Body() body: GoogleLoginBody): Promise<LoginResponse> {
    return authService.loginWithGoogle(body.idToken);
  }

  @Post("register")
  @SuccessResponse(201, "Registered")
  async register(@Body() body: RegisterBody): Promise<void> {
    await authService.register(body);
    this.setStatus(201);
  }

  /** Requires `Authorization: Bearer <token>` from login. */
  @Get("me")
  @Security("bearerAuth")
  @SuccessResponse(200, "OK")
   me(@Request() req: ExpressRequest): MeResponse {
    if (!req.user) {
      this.setStatus(401);
      throw new Error("Unauthorized");
    }
    return { user: req.user };
  }
}
