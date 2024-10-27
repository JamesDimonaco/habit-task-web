"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { HabbitType } from "@/lib/types";
import { getHabbitChartData } from "@/lib/server/habbit-actions";
import { useEffect, useState } from "react";

const chartConfig = {
  logged: {
    label: "Habbit Logged",
  },
} satisfies ChartConfig;

export function HabbitBarChart({ habbit }: { habbit: HabbitType }) {
  const [chartData, setChartData] = useState<
    Array<{ date: string; logged: boolean }>
  >([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getHabbitChartData(habbit.id);
      setChartData(data);
    };
    fetchChartData();
  }, [habbit.id]);
  console.log(chartData);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - {habbit.name}</CardTitle>
          <CardDescription>Daily habit tracking visualization</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-UK", {
                  day: "numeric",
                  month: "short",
                });
              }}
            />
            <Bar
              dataKey="logged"
              fill={`var(--chart-5)`}
              maxBarSize={20}
              isAnimationActive={true}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
