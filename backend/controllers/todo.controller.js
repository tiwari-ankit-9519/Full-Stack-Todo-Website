import { PrismaClient } from "@prisma/client";
import { createTodoSchema } from "../utils/validators.js";

const prisma = new PrismaClient();

export const createTodo = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required!" });
  }

  const result = createTodoSchema.safeParse({
    title,
    content,
  });

  if (!result.success) {
    const errorMessage = result.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errorMessage });
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      content,
      userId: req.userAuthId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      done: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  res.status(201).json({
    message: "Todo created successfully!",
    todo,
  });
};

export const getAllTodos = async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userAuthId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      done: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    message: "Todos fetched successfully!",
    todos,
  });
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required!" });
  }

  const result = createTodoSchema.safeParse({
    title,
    content,
  });

  if (!result.success) {
    const errorMessage = result.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errorMessage });
  }

  const todo = await prisma.todo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
      done: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  res.status(200).json({
    message: "Todo updated successfully!",
    todo,
  });
};

export const completeTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const currentTodo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        done: true,
      },
    });

    if (!currentTodo) {
      return res.status(404).json({ message: "Todo not found!" });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        done: !currentTodo.done,
      },
      select: {
        id: true,
        title: true,
        content: true,
        done: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Todo status updated successfully!",
      todo: updatedTodo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    message: "Todo deleted successfully!",
  });
};
