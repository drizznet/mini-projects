import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Patch,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
  Query,
} from "tsoa";
import type { Request as ExpressRequest } from "express";
import { commitmentService } from "./commitment.service";
import type {
  CommitmentListResponse,
  CommitmentPriority,
  CommitmentStatus,
  CommitmentResponse,
  CreateCommitmentBody,
  UpdateCommitmentBody,
} from "./commitment.types";

@Route("api/lockedin/plans")
@Tags("Lockin Plans")
export class CommitmentsController extends Controller {
  @Get()
  @Security("bearerAuth")
  public list(
    @Request() request: ExpressRequest,
    @Query() status?: CommitmentStatus,
    @Query() priority?: CommitmentPriority,
  ): Promise<CommitmentListResponse> {
    return commitmentService.list(request.user!.email, { status, priority });
  }

  @Get("{id}")
  @Security("bearerAuth")
  public get(
    @Request() request: ExpressRequest,
    @Path() id: string,
  ): Promise<CommitmentResponse> {
    return commitmentService.get(request.user!.email, id);
  }

  @Post()
  @Security("bearerAuth")
  @SuccessResponse(201, "Created")
  public async create(
    @Request() request: ExpressRequest,
    @Body() body: CreateCommitmentBody,
  ): Promise<CommitmentResponse> {
    this.setStatus(201);
    return commitmentService.create(request.user!.email, body);
  }

  @Patch("{id}")
  @Security("bearerAuth")
  public update(
    @Request() request: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateCommitmentBody,
  ): Promise<CommitmentResponse> {
    return commitmentService.update(request.user!.email, id, body);
  }

  @Delete("{id}")
  @Security("bearerAuth")
  @SuccessResponse(204, "No Content")
  public async delete(
    @Request() request: ExpressRequest,
    @Path() id: string,
  ): Promise<void> {
    await commitmentService.delete(request.user!.email, id);
    this.setStatus(204);
  }
}
