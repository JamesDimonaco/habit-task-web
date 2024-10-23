import { HabbitType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

export const Habbit = ({ habbit }: { habbit: HabbitType }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <Card>
        <CardHeader className="flex justify-between flex-row gap-2">
          <CardTitle>{habbit.name}</CardTitle>
          <Badge>{habbit.frequency}</Badge>
        </CardHeader>
        <CardContent>
          <p>{habbit.description}</p>
          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>

            <Button>Log Habbit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
