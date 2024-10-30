"use client";

import { HabitType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { logHabit } from "@/lib/server/habit-actions";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";
import { HabitContributionGraph } from "./charts/habit-contribution-graph";

type ToastVariant = "default" | "destructive" | null | undefined;

export const Habit = ({ habit }: { habit: HabitType }) => {
  const { toast } = useToast();

  const handleLogHabit = async () => {
    const { message, variant } = await logHabit(habit.id);
    console.log(message);

    toast({
      title: message,
      variant: variant as ToastVariant,
    });
  };

  return (
    <div className="flex justify-center items-center h-full flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-between flex-row gap-2">
          <Badge>
            {habit.frequency}: {habit.logs.length}
          </Badge>
          <CardTitle>{habit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{habit.description}</p>
          <Button onClick={handleLogHabit}>Log Habit</Button>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full max-w-2xl">
          <HabitContributionGraph habit={habit} />
        </div>
      </Suspense>
    </div>
  );
};
