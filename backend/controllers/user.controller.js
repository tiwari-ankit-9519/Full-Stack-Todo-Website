import { PrismaClient } from "@prisma/client";
import { createUserSchema, loginUserSchema } from "../utils/validators.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const result = createUserSchema.safeParse({
    name,
    email,
    password,
    gender,
  });

  if (!result.success) {
    const errorMessage = result.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errorMessage });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      gender,
    },
  });

  res.status(201).json({
    message: "User created successfully",
    user,
    token: generateToken(user.id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const result = loginUserSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    const errorMessage = result.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errorMessage });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const userWithoutPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
    },
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: userWithoutPassword,
    token: generateToken(user.id),
  });
};
