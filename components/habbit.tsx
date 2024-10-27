"use client";

import { HabbitType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { logHabbit } from "@/lib/server/habbit-actions";
import { useToast } from "@/hooks/use-toast";
import { HabbitBarChart } from "./charts/habbit-bar";
import { Suspense } from "react";
import { HabbitRadicalChart } from "./charts/habbit-radical";
import { HabbitContributionGraph } from "./charts/habbit-contribution-graph";

type ToastVariant = "default" | "destructive" | null | undefined;

export const Habbit = ({ habbit }: { habbit: HabbitType }) => {
  const { toast } = useToast();

  const handleLogHabbit = async () => {
    const { message, variant } = await logHabbit(habbit.id);
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
            {habbit.frequency}: {habbit.logs.length}
          </Badge>
          <CardTitle>{habbit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{habbit.description}</p>
          <Button onClick={handleLogHabbit}>Log Habbit</Button>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full max-w-2xl">
          <HabbitContributionGraph habbit={habbit} />
          {/* <HabbitBarChart habbit={habbit} /> */}
        </div>
        {/* <HabbitRadicalChart /> */}
      </Suspense>
    </div>
  );
};
