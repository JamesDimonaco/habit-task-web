"use server";

import { ID, Permission, Query, Role } from "node-appwrite";
import { habbitFormSchema } from "../formSchemas";
import { createDatabasesClient, getLoggedInUser } from "./appwrite";
import { redirect } from "next/navigation";
import { HabbitType } from "../types";
import { revalidatePath } from "next/cache";

export async function createHabbit(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = habbitFormSchema.safeParse(formData);
  const user = await getLoggedInUser();

  if (!user?.$id) {
    return {
      message: "User not found",
    };
  }

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: "Invalid form data",
    };
  }
  const databases = await createDatabasesClient();
  console.log(parsedData.data);

  try {
    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID ?? "",
      process.env.APPWRITE_HABBITS_COLLECTION_ID ?? "",
      ID.unique(),
      parsedData.data,
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );
    revalidatePath("/dashboard");

    return {
      message: "Habbit created",
      name: response.name,
      id: response.$id,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to create habbit",
      error: error,
    };
  }
}

export async function getHabbit(habbitId: string): Promise<HabbitType | null> {
  try {
    const databases = await createDatabasesClient();
    const response = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID ?? "",
      process.env.APPWRITE_HABBITS_COLLECTION_ID ?? "",
      habbitId
    );
    return {
      name: response.name,
      description: response.description,
      frequency: response.frequency,
      id: response.$id,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getHabbits(): Promise<
  HabbitType[] | { message: string }
> {
  const user = await getLoggedInUser();

  if (!user?.$id) {
    return {
      message: "User not found",
    };
  }

  const databases = await createDatabasesClient();
  const response = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID ?? "",
    process.env.APPWRITE_HABBITS_COLLECTION_ID ?? ""
  );
  return response.documents.map((doc) => ({
    name: doc.name,
    description: doc.description,
    frequency: doc.frequency,
    id: doc.$id,
    icon: doc.icon,
  }));
}

export async function deleteHabbit(habbitId: string) {
  const databases = await createDatabasesClient();
  await databases.deleteDocument(
    process.env.APPWRITE_DATABASE_ID ?? "",
    process.env.APPWRITE_HABBITS_COLLECTION_ID ?? "",
    habbitId
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
