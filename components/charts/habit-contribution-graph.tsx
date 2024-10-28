import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHabitChartData } from "@/lib/server/habit-actions";
import { HabitType } from "@/lib/types";

export function HabitContributionGraph({ habit }: { habit: HabitType }) {
  const [chartData, setChartData] = useState<
    Array<{ date: string; logged: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const data = await getHabitChartData(habit.id);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching habit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [habit.id]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const processData = () => {
    // Start from January 1st of current year
    const startDate = new Date(2024, 0, 1);
    const today = new Date();
    const totalDays = 366; // 52 weeks * 7 days

    // Calculate day of week offset for January 1st (0 = Sunday, 6 = Saturday)
    const startDayOffset = startDate.getDay();

    // Create array for full grid including padding days
    const squares = Array.from(
      { length: totalDays + startDayOffset },
      (_, index) => {
        if (index < startDayOffset) {
          // Add empty squares for padding
          return { date: "", active: false, isEmpty: true };
        }

        const currentDate = new Date(startDate);

        currentDate.setDate(currentDate.getDate() + (index - startDayOffset));
        const dateString = currentDate.toISOString().split("T")[0];

        const isToday = dateString === today.toISOString().split("T")[0];

        const habitEntry = chartData.find((entry) => entry.date === dateString);
        const isFuture = currentDate > today;

        return {
          date: dateString,
          active: habitEntry?.logged || false,
          isToday,
          isEmpty: false,
          isFuture,
        };
      }
    );

    return squares;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse bg-muted rounded-lg w-full h-full" />
      </div>
    );
  }

  const squares = processData();

  return (
    <div className="inline-grid gap-2 w-full max-w-4xl">
      {/* Months row */}
      <div className="grid grid-flow-col auto-cols-fr ml-8">
        {monthsOfYear.map((month) => (
          <LabelPrimitive.Root
            key={month}
            className="text-sm text-muted-foreground"
          >
            {month}
          </LabelPrimitive.Root>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Days column */}
        <div className="grid grid-rows-7 gap-2 mr-2">
          {daysOfWeek.map((day) => (
            <LabelPrimitive.Root
              key={day}
              className="text-sm text-muted-foreground h-4 w-4 flex items-center"
            >
              {day}
            </LabelPrimitive.Root>
          ))}
        </div>

        <div
          className="grid grid-rows-7 grid-flow-col gap-2 flex-1"
          style={{
            gridTemplateColumns: `repeat(53, minmax(0, 1fr))`,
          }}
        >
          <TooltipProvider>
            {squares.map((square, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-sm transition-colors",
                      square.isEmpty
                        ? "bg-transparent"
                        : square.isToday
                        ? "bg-primary hover:bg-primary/90" // Today's square
                        : square.active
                        ? "bg-green-500 hover:bg-green-600" // Active squares
                        : square.isFuture
                        ? "bg-blue-400 hover:bg-blue-500" // Future squares
                        : "bg-gray-800 hover:bg-gray-900" // Inactive squares
                    )}
                  />
                </TooltipTrigger>
                {!square.isEmpty && (
                  <TooltipContent>
                    <div className="text-sm">
                      <div>{new Date(square.date).toLocaleDateString()}</div>
                      <div>
                        {square.isToday
                          ? "Today"
                          : square.active
                          ? "Completed"
                          : "Not completed"}
                      </div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
