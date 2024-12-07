import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  updateTodo,
  completeTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.post("/create", isLoggedIn, createTodo);
router.post("/complete/:id", isLoggedIn, completeTodo);
router.get("/all", isLoggedIn, getAllTodos);
router.put("/update/:id", isLoggedIn, updateTodo);
router.delete("/delete/:id", isLoggedIn, deleteTodo);

export default router;
