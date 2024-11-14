"use server";

import { habitFormSchema } from "../formSchemas";
import { api } from "./api-wrapper";

export async function getHabits() {
  try {
    const habits = await api("habits", "GET");
    return await habits.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteHabit(habitId: string) {
  await api(`habit/${habitId}`, "DELETE");
}

export async function createHabit(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = habitFormSchema.safeParse(formData);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: "Invalid form data",
    };
  }
  const response = await api("habit", "POST", parsedData.data);
  console.log("-----------");

  console.log(response);

  console.log("-----------");
  console.log(await response.json());
  console.log("-----------");

  return await response.json();
}
