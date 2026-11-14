import {
  Controller,
  Get,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import type { Request as ExpressRequest } from "express";
import { todayService } from "./today.service";
import type { TodayResponse } from "./today.types";

@Route("api/lockedin/today")
@Tags("Lockin Today")
export class TodayController extends Controller {
  @Get()
  @Security("bearerAuth")
  public get(@Request() request: ExpressRequest): Promise<TodayResponse> {
    return todayService.get(request.user!.email);
  }
}
