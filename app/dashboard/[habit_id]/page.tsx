import { Habit } from "@/components/habit";
import { getHabit } from "@/lib/server/habit-actions";

export default async function Page({
  params,
}: {
  params: { habit_id: string };
}) {
  const { habit_id } = await params;
  const habit = await getHabit(habit_id);

  if (!habit) {
    return <div>Habit not found</div>;
  }

  return <Habit habit={habit} />;
}
