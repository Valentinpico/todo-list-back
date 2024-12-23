import express, { Application } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import todoRoutes from "./routes/todo.routes";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Rutas
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
