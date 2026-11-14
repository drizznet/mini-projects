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
} from "tsoa";
import type { Request as ExpressRequest } from "express";
import { categoryService } from "./category.service";
import type {
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "./category.types";

@Route("api/lockedin/categories")
@Tags("Lockin Categories")
export class CategoriesController extends Controller {
  @Get()
  @Security("bearerAuth")
  public list(@Request() request: ExpressRequest): Promise<CategoryListResponse> {
    return categoryService.list(request.user!.email);
  }

  @Get("{id}")
  @Security("bearerAuth")
  public get(
    @Request() request: ExpressRequest,
    @Path() id: string,
  ): Promise<CategoryResponse> {
    return categoryService.get(request.user!.email, id);
  }

  @Post()
  @Security("bearerAuth")
  @SuccessResponse(201, "Created")
  public async create(
    @Request() request: ExpressRequest,
    @Body() body: CreateCategoryBody,
  ): Promise<CategoryResponse> {
    this.setStatus(201);
    return categoryService.create(request.user!.email, body);
  }

  @Patch("{id}")
  @Security("bearerAuth")
  public update(
    @Request() request: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateCategoryBody,
  ): Promise<CategoryResponse> {
    return categoryService.update(request.user!.email, id, body);
  }

  @Delete("{id}")
  @Security("bearerAuth")
  @SuccessResponse(204, "No Content")
  public async delete(
    @Request() request: ExpressRequest,
    @Path() id: string,
  ): Promise<void> {
    await categoryService.delete(request.user!.email, id);
    this.setStatus(204);
  }
}
