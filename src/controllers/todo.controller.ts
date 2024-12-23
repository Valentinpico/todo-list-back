import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { uuid } from "../adapters/uuid";

export const createTodo = async (req: Request, res: Response) => {
  const { title, userId } = req.body;

  const id = uuid();

  const obligatoryFields = ["title", "userId"];

  const missingFields = obligatoryFields.filter((field) => !req.body[field]);

  if (missingFields.length) {
    res.status(400).json({
      error: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
    });
    return;
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        id,
        title,
        completed: false,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "To-Do creado correctamente",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
export const getUserWithAllToDos = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Falta el id del usuario",
      success: false,
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id as string,
      },
      select: {
        id: true,
        username: true,
        email: true,
        todos: {
          select: {
            id: true,
            title: true,
            completed: true,
            createdAt: true,
          },
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        },
      },
    });

    if (!user) {
      res.status(404).json({
        message: "Usuario no encontrado",
        success: false,
      });
      return;
    }

    //ordenar los todos por completado, los completados ultimos
    user.todos.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (!a.completed && b.completed) {
        return -1;
      }
      return 0;
    });

    res.status(200).json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(400)
      .json({ success: false, message: "Falta el id del ToDo", data: null });
    return;
  }

  try {
    const todo = await prisma.todo.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      success: true,
      message: "To-Do eliminado correcatmente",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const editTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ success: false, message: "Falta el id del ToDo", data: null });
    return;
  }
  const { title, completed } = req.body;

  if (!title && !completed) {
    res.status(400).json({
      success: false,
      message: "Se requiere al menos un campo para actualizar",
    });
    return;
  }

  try {
    const todo = await prisma.todo.update({
      where: {
        id: id as string,
      },
      data: {
        title,
        completed,
      },
    });

    res.status(200).json({
      success: true,
      message: "To-Do actualizado correctamente",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as any).message,
    });
  }
};

export const deleteAllTodosByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "Falta el id del usuario",
      data: null,
    });
    return;
  }

  try {
    const todos = await prisma.todo.deleteMany({
      where: {
        userId: userId as string,
      },
    });

    res.status(200).json({
      success: true,
      message: "To-Dos eliminados correctamente",
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as any).message,
    });
  }
};
