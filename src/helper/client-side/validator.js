import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}\[\]~]).{6,}$/;

export const signupSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please provide a valid email address")
      .max(64, "Email must not exceed 64 characters"),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
      ),

    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, "Confirm Password must be at least 6 characters long"),

    firstName: z
      .string({ required_error: "First name is required" })
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must not exceed 50 characters"),

    lastName: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .max(64, "Email must not exceed 64 characters"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .regex(
      passwordRegex,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
});
