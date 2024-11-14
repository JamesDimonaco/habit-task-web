"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { api } from "./api-wrapper";

type SessionPayload = {
  token: string;
};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRE;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRE;

export async function encrypt(payload: SessionPayload, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function createSessions(
  access_token: string,
  refresh_token: string
) {
  const accessToken = await encrypt(
    { token: access_token },
    accessTokenExpiresIn || "30m"
  );
  const refreshToken = await encrypt(
    { token: refresh_token },
    refreshTokenExpiresIn || "7d"
  );

  (await cookies()).set("habitask-access-token", accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  (await cookies()).set("habitask-refresh-token", refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
}

export async function getTokens() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("habitask-access-token");
  const refreshToken = cookieStore.get("habitask-refresh-token");

  const decryptedAccessToken = await decrypt(accessToken?.value);
  const decryptedRefreshToken = await decrypt(refreshToken?.value);

  return {
    accessToken: decryptedAccessToken?.token,
    refreshToken: decryptedRefreshToken?.token,
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("habitask-access-token");
  cookieStore.delete("habitask-refresh-token");
}

export async function updateSession(
  access_token: string,
  refresh_token: string
) {
  await deleteSession();
  await createSessions(access_token, refresh_token);
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await api("refresh-token", "POST", refreshToken, false);
  const { access_token, refresh_token } = await response.json();
  await updateSession(access_token, refresh_token);
}
