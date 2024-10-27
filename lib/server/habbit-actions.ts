"use server";

import { ID, Permission, Role } from "node-appwrite";
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
      icon: response.icon,
      logs: response.logs,
      createdAt: response.$createdAt,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getHabbits(): Promise<HabbitType[]> {
  const user = await getLoggedInUser();

  if (!user?.$id) {
    return [];
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
    logs: doc.logs,
    createdAt: doc.$createdAt,
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

export async function logHabbit(habbitId: string) {
  const date = new Date();

  const habbit = await getHabbit(habbitId);

  if (!habbit) {
    return {
      message: "Habbit not found",
      variant: "destructive",
    };
  }

  if (
    habbit.logs.find(
      (log) => log.date.split("T")[0] === date.toISOString().split("T")[0]
    )
  ) {
    return {
      message: "Habbit already logged today",
      variant: "default",
    };
  }

  const databases = await createDatabasesClient();

  try {
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID ?? "",
      process.env.APPWRITE_HABBITS_LOG_COLLECTION_ID ?? "",
      ID.unique(),
      {
        date: date.toISOString(),
        habbit: habbitId,
      }
    );
    return {
      message: "Habbit logged successfully",
      variant: "default",
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to log habbit",
    };
  }
}
export async function updateHabbit(habbitId: string, data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = habbitFormSchema.safeParse(formData);
  if (!parsedData.success) {
    return {
      message: "Invalid form data",
    };
  }

  const databases = await createDatabasesClient();
  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID ?? "",
    process.env.APPWRITE_HABBITS_COLLECTION_ID ?? "",
    habbitId,
    parsedData.data
  );
}

export async function getHabbitChartData(habbitId: string) {
  const habbit = await getHabbit(habbitId);

  if (!habbit) {
    return [];
  }

  const createdDate = new Date(habbit.createdAt);
  const today = new Date();

  const daysBetween = Math.ceil(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const chartData = [];

  for (let i = 0; i <= daysBetween; i++) {
    const date = new Date(createdDate);
    date.setDate(date.getDate() + i);

    const log = habbit.logs.find(
      (log) => log.date.split("T")[0] === date.toISOString().split("T")[0]
    );

    chartData.push({
      date: date.toISOString().split("T")[0],
      logged: !!log,
    });
  }

  return chartData;
}
