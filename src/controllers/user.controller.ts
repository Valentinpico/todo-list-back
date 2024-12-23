import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { User } from "../types/types";
import { uuid } from "../adapters/uuid";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password }: User = req.body;
  const id = uuid();

  const obligatoryFields = ["username", "email", "password"];

  const missingFields = obligatoryFields.filter((field) => !req.body[field]);

  if (missingFields.length) {
    res.status(400).json({
      success: false,
      messsage: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
      data: null,
    });
    return;
  }

  try {
    // Validar que el email y el username no estén en uso con una sola consulta
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailExists) {
      res.status(400).json({
        success: false,
        message: "El email ya está en uso",
        data: null,
      });
      return;
    }

    const usernameExists = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (usernameExists) {
      res.status(400).json({
        success: false,
        message: "El username ya está en uso",
        data: null,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        id,
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any).message, data: null, success: false });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json({
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: (error as any).message, data: null });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, username, password }: User = req.body;

  if (!email && !username) {
    res.status(400).json({
      success: false,
      message: "Se requiere el email o el username",
    });
    return;
  }

  if (!password) {
    res
      .status(400)
      .json({ success: false, message: "Se requiere la contraseña" });
    return;
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        todos: {
          select: {
            id: true,
            title: true,
            completed: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as any).message,
    });
  }
};
