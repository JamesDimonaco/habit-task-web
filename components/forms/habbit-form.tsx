"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { habbitFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createHabbit } from "@/lib/server/habbit-actions";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";

export function HabbitForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof habbitFormSchema>>({
    resolver: zodResolver(habbitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "daily",
      icon: "",
    },
  });

  async function onSubmit(data: z.infer<typeof habbitFormSchema>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const { error, name, id, message } = await createHabbit(formData);
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to create habbit",
        description: message,
      });
    } else {
      toast({
        title: `Habbit ${name} created`,
        description: "Your habbit has been created",
        action: (
          <ToastAction
            onClick={() => router.push(`/dashboard/${id}`)}
            altText="Go to habbit"
          >
            Go to habbit
          </ToastAction>
        ),
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm ">
      <CardHeader>
        <CardTitle className="text-2xl">Create Habbit</CardTitle>
        <CardDescription>Enter your habbit details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Habbit Name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your habbit name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <Input id="description" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="frequency">Frequency</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Habbit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
