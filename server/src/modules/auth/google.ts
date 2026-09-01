import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../errors";

const client = new OAuth2Client();

export type GoogleIdentity = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

/** Verifies a Google ID token (GIS / frontend). Rejects tokens not issued for our client ID. */
export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleIdentity> {
  const audience = process.env.GOOGLE_CLIENT_ID;
  if (!audience) {
    throw new AppError(500, "GOOGLE_CLIENT_ID is not configured");
  }

  try {
    const ticket = await client.verifyIdToken({ idToken, audience });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new AppError(401, "Invalid Google token");
    }

    return {
      sub: payload.sub,
      email: payload.email.trim().toLowerCase(),
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "Invalid Google token");
  }
}
