import zod from "zod";

export const createUserSchema = zod.object({
  name: zod
    .string()
    .min(3, { message: "Name but be at least 3 character long" }),
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  gender: zod.string().min(4, { message: "Please enter gender" }),
});

export const loginUserSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const createTodoSchema = zod.object({
  title: zod
    .string()
    .min(3, { message: "Title must be at least 3 characters" }),
  content: zod
    .string()
    .min(6, { message: "Content must be at least 6 characters" }),
});
