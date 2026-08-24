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
  ApprovalDecisionBody,
  ClaimResponse,
  PendingApprovalsResponse,
} from "./claim.types";

@Route("api/approvals")
@Tags("Approvals")
export class ApprovalsController extends Controller {
  @Get()
  public listPending(): PendingApprovalsResponse {
    return claimsService.listPendingApprovals();
  }

  @Post("{id}")
  @SuccessResponse(200, "OK")
  public decide(
    @Path() id: string,
    @Body() body: ApprovalDecisionBody,
  ): ClaimResponse {
    return claimsService.decideApproval(id, body);
  }
}
