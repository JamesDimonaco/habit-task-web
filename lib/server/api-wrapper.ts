"use server";

import { getTokens } from "./session";

export const api = async <T>(
  endpoint: string,
  method: string,
  body: T | null = null,
  requiresAuth: boolean = true
) => {
  const { accessToken, refreshToken } = await getTokens();
  if (requiresAuth) {
    if (!accessToken || !refreshToken) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await fetch(
        process.env.SERVER_URL + "/api/" + endpoint,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: method,
          body: body ? JSON.stringify(body) : null,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      // if (error.detail === "Token expired.") {
      //   await refreshAccessToken(refreshToken);
      //   return api(endpoint, method, body, false);
      // }
      // throw new Error("Failed to fetch data");
    }
  }

  return fetch(process.env.SERVER_URL + "/api/" + endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: method,
    body: body ? JSON.stringify(body) : null,
  });
};
