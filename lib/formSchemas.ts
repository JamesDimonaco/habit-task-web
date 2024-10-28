import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const habitFormSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().max(200).optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  icon: z.string().optional(),
});
