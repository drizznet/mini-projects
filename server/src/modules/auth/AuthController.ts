/**
 * Auth HTTP surface. DTOs in `auth.types.ts`; user row type in `src/types/user.ts`.
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
import { login } from "./auth.service";
import type { LoginBody, LoginResponse, MeResponse } from "./auth.types";

@Route("api/auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("login")
  @SuccessResponse(200, "Logged in")
  public login(@Body() body: LoginBody): LoginResponse {
    return login(body.email, body.password);
  }

  /** Requires `Authorization: Bearer <token>` from login. */
  @Get("me")
  @Security("bearerAuth")
  @SuccessResponse(200, "OK")
  public me(@Request() req: ExpressRequest): MeResponse {
    if (!req.user) {
      this.setStatus(401);
      throw new Error("Unauthorized");
    }
    return { user: req.user };
  }
}
