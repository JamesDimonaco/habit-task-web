"use server";
import { Client, Account, ID, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { loginFormSchema, signupFormSchema } from "@/lib/formSchemas";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const cookieStore = cookies();
  const session = (await cookieStore).get("habitask-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "")
    .setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createDatabasesClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "")
    .setKey(process.env.NEXT_APPWRITE_KEY ?? "");

  return new Databases(client);
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "")
    .setKey(process.env.NEXT_APPWRITE_KEY ?? "");

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
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

  const { account } = await createAdminClient();
  await account.create(
    ID.unique(),
    parsedData.data.email,
    parsedData.data.password,
    parsedData.data.name
  );
  const session = await account.createEmailPasswordSession(
    parsedData.data.email,
    parsedData.data.password
  );

  const cookieStore = cookies();
  (await cookieStore).set("habitask-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

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

  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(
    parsedData.data.email,
    parsedData.data.password
  );

  const cookieStore = cookies();
  (await cookieStore).set("habitask-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/dashboard");
}

export async function onSubmitUserLogout() {
  const cookieStore = cookies();
  (await cookieStore).delete("habitask-session");
  redirect("/login");
}
