import { Habbit } from "@/components/habbit";
import { getHabbit } from "@/lib/server/habbit-actions";
import { HabbitType } from "@/lib/types";

export default async function Page({
  params,
}: {
  params: { habbit_id: string };
}) {
  const { habbit_id } = await params;
  const habbit = await getHabbit(habbit_id);

  if (!habbit) {
    return <div>Habbit not found</div>;
  }

  return <Habbit habbit={habbit} />;
}
