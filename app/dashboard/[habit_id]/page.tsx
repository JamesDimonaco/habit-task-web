import { Habit } from "@/components/habit";
import { getHabit } from "@/lib/server/habit-actions";
export const dynamic = "force-dynamic";

type Params = Promise<{ habit_id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { habit_id } = await params;
  const habit = await getHabit(habit_id);

  if (!habit) {
    return <div>Habit not found</div>;
  }

  return <Habit habit={habit} />;
}
