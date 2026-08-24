/**
 * General Express API server.
 * Feature controllers under `src/modules` drive routes + OpenAPI via TSOA.
 * Run `pnpm generate` (or `pnpm dev`, which watches) after adding/changing controllers.
 */
import "dotenv/config";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "@tsoa/runtime";
import { AppError } from "./errors";
import { RegisterRoutes } from "./generated/routes";
import swaggerDocument from "./generated/swagger.json";

const PORT = Number(process.env.PORT ?? 4400);
const corsOrigin = (process.env.CORS_ORIGIN ?? "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

/** Default: 100 requests per 15 minutes per IP. Override via env. */
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000,
);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 100);

export function createApp() {
  const app = express();

  // Behind nginx/Cloudflare/etc., trust X-Forwarded-For so rate limits use the real client IP.
  if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
    app.set("trust proxy", 1);
  }

  // Helmet first so security headers apply to every response.
  // CSP allows inline assets required by Swagger UI at /docs.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "validator.swagger.io"],
        },
      },
    }),
  );

  app.use(
    cors({
      origin: corsOrigin.includes("*") ? true : corsOrigin,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
    // Keep load-balancer / k8s probes from burning the quota.
    skip: (req) => req.path === "/health",
  });
  app.use(limiter);

  // Auto-generated from controllers — do not register routers by hand.
  RegisterRoutes(app);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/openapi.json", (_req, res) => {
    res.json(swaggerDocument);
  });

  app.use(
    (
      err: unknown,
      _req: Request,
      res: Response,
      next: NextFunction,
    ): void => {
      if (res.headersSent) {
        next(err);
        return;
      }

      if (err instanceof ValidateError) {
        res.status(422).json({
          error: "Validation Failed",
          details: err.fields,
        });
        return;
      }

      if (err instanceof AppError) {
        res.status(err.status).json({ error: err.message });
        return;
      }

      if (err && typeof err === "object" && "status" in err) {
        const status = Number((err as { status: number }).status) || 500;
        const message =
          err instanceof Error ? err.message : "Unexpected error";
        res.status(status).json({ error: message });
        return;
      }

      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    },
  );

  return app;
}

const app = createApp();

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/docs`);
});
