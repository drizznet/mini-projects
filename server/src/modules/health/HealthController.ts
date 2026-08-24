import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";

export interface HealthResponse {
  ok: boolean;
  service: string;
}

@Route("health")
@Tags("Health")
export class HealthController extends Controller {
  /**
   * Liveness probe — not rate-limited at the Express layer.
   */
  @Get()
  @SuccessResponse(200, "OK")
  public getHealth(): HealthResponse {
    return { ok: true, service: "server" };
  }
}
