import { Router } from "express";
import {
  createTodo,
  getUserWithAllToDos,
  deleteAllTodosByUserId,
  deleteTodoById,
  editTodoById,
} from "../controllers/todo.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id", authenticate, getUserWithAllToDos);
router.post("/", authenticate, createTodo);
router.delete("/:id", authenticate, deleteTodoById);
router.delete("/user/:id", authenticate, deleteAllTodosByUserId);
router.put("/:id", authenticate, editTodoById);

export default router;
