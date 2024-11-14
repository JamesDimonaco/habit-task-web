"use server";

import { api } from "@/lib/server/api-wrapper";
import { signupFormSchema, loginFormSchema } from "../formSchemas";
import { redirect } from "next/navigation";
import { createSessions, deleteSession } from "./session";

export async function getUser() {
  try {
    const user = await api("user", "GET");
    return await user.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function onSubmitUserSignup(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = signupFormSchema.safeParse(formData);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: "Invalid form data",
    };
  }

  const response = await api("register", "POST", parsedData.data, false);
  const { access_token, refresh_token } = await response.json();
  await createSessions(access_token, refresh_token);

  redirect("/dashboard");
}

export async function onSubmitUserLogin(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = loginFormSchema.safeParse(formData);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: "Invalid form data",
    };
  }

  const response = await api("login", "POST", parsedData.data, false);
  const { access_token, refresh_token } = await response.json();

  await createSessions(access_token, refresh_token);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
