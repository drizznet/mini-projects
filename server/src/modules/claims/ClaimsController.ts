import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import * as claimsService from "./claims.service";
import type {
  ClaimListResponse,
  ClaimResponse,
  CreateClaimBody,
} from "./claim.types";

@Route("api/claims")
@Tags("Claims")
export class ClaimsController extends Controller {
  @Get()
  public listClaims(): ClaimListResponse {
    return claimsService.listClaims();
  }

  @Get("{id}")
  public getClaim(@Path() id: string): ClaimResponse {
    return claimsService.getClaim(id);
  }

  @Post()
  @SuccessResponse(201, "Created")
  public createClaim(@Body() body: CreateClaimBody): ClaimResponse {
    this.setStatus(201);
    return claimsService.createClaim(body);
  }
}
