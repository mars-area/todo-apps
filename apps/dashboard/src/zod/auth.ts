import z from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: iss => (iss.input === "" ? "Please enter your email" : undefined)
  }),
  password: z.string().min(1, "Please enter your password").min(8, "Password must be at least 8 characters long")
});

export const signupSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.email({
    error: iss => (iss.input === "" ? "Please enter your email" : undefined)
  }),
  password: z.string().min(1, "Please enter your password").min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please enter your password").min(8, "Password must be at least 8 characters long")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

