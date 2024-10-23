import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();
  console.log(user);

  if (!user) redirect("/signup");

  redirect("/dashboard");
}
