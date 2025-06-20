import "server-only";
import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}\[\]~]).{6,}$/;

export const signinSchema = z.object({
  email: z.string().trim().email().max(64),
  password: z.string().min(6).regex(passwordRegex),
});

export const signupSchema = z
  .object({
    email: z.string().trim().email().max(64),
    password: z.string().min(6).regex(passwordRegex),
    confirmPassword: z.string().min(6),
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });
