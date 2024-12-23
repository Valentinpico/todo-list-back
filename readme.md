# Documentación del Backend

## Descripción del Proyecto

Una aplicación sencilla de lista de tareas (To-Do) con autenticación de usuarios y gestión de tareas.

## Funcionalidades

- Autenticación de usuarios basada en JWT
- Operaciones CRUD para usuarios y tareas (todos)
- Seguridad basada en tokens para rutas protegidas
- Base de datos PostgreSQL
- Uso de TypeScript para garantizar la seguridad de tipos
- Prisma ORM para interacciones con la base de datos

---

## Requisitos Previos

1. [Node.js](https://nodejs.org/) (versión 18.x o superior)
2. [PostgreSQL](https://www.postgresql.org/) (versión 12.x o superior)
3. [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

---

## Pasos de Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Valentinpico/todo-list-back
   cd todo-list-back
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

---

## Variables de Entorno

Crea un archivo `.env` en el directorio raíz y añade las siguientes variables:

```env
PORT=3000
DATABASE_URL="postgres://<usuario>:<contraseña>@localhost:5432/todo"
JWT_SECRET=secretKeyValetinpico
```

Reemplaza `<usuario>`y `<contraseña>` con tus credenciales de PostgreSQL y el nombre de la base de datos se queda igual para mejor funcionalidad

---

## Configuración de PostgreSQL

Puedes usar el PGadmin y crear la base de datos manual, aca dejo los pasos en la linea de comandos:

1. Inicia PostgreSQL y accede a la consola de comandos:

   ```bash
   psql -U postgres
   ```

2. Crea una nueva base de datos:

   ```sql
   CREATE DATABASE todos;
   ```

3. (Opcional) Crea un usuario con contraseña y otorga acceso:

   ```sql
   CREATE USER todo_user WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE todos_app TO todo_user;
   ```

Actualiza el `DATABASE_URL` en tu archivo `.env` con estas credenciales si create un nuevo usuario.

---

## Configuración de Prisma

1. Genera el cliente de Prisma:

   ```bash
   npx prisma generate
   ```

2. Aplica el esquema a la base de datos:

   ```bash
   npx prisma db push
   ```

3. Verifica la base de datos:

   ```bash
   npx prisma studio
   ```

   Usa la interfaz web de Prisma Studio para inspeccionar tu base de datos.

---

## Configuración de TypeScript

El proyecto utiliza TypeScript para garantizar la seguridad de tipos. El archivo `tsconfig.json` ya está configurado. Si es necesario, puedes ajustarlo:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## Scripts Disponibles

- **Iniciar el Servidor en Desarrollo**:

  ```bash
  npm run dev
  ```

- **Construir el Proyecto**:

  ```bash
  npm run build
  ```

- **Iniciar el Servidor en Producción**:

  ```bash
  npm start
  ```

---

## Endpoints de la API

### url base: `http://localhost:3000`

### Autenticación

- **POST** `/users/login`

  - Cuerpo de la solicitud: `{ email, username, password }` cualquiera de los dos email o username
  - Respuesta: `{ token }` devuelve el id dentro del token

- **POST** `/users/`

  - Cuerpo de la solicitud: `{ username, email, password }`
  - Respuesta: `{ message, user }`

- **GET** `/users/`
  - Respuesta: Lista de usuarios en la base de datos

### Tareas (Todos)

- **GET** `/todos/<id del usuario (uuidV4)>`

  - Headers: `Authorization: Bearer <token>`
  - Respuesta: trae al usuario y a su lista de tareas

- **POST** `/todos`

  - Headers: `Authorization: Bearer <token>`
  - Cuerpo de la solicitud: `{ title, completed, userId }`
  - Respuesta: Tarea creada de usuario x

- **PUT** `/todos/<id de la tarea en (uuidV4)>`

  - Headers: `Authorization: Bearer <token>`
  - Cuerpo de la solicitud: `{ title, completed }`
  - Respuesta: Tarea editada de usuario x

- **DELETE** `/todos/<id de la tarea en (uuidV4)>`

  - Headers: `Authorization: Bearer <token>`
  - Cuerpo de la solicitud: `{ title, completed }`
  - Respuesta: Tarea elimindada de usuario x

---

## Estructura del Proyecto

```plaintext
src/
├── adapters/     # adaptadores de librerias 
├── controllers/  # Funciones controladoras
├── middlewares/  # Middleware de autenticación
├── routes/       # Definiciones de rutas de Express
├── types/        # types 
├── utils/        # Funciones utilitarias (e.g., helpers de JWT)
└── server.ts     # Punto de entrada del servidor
```

---



## Solución de Problemas

- **Problemas de Conexión a la Base de Datos**:

  - Verifica que PostgreSQL esté funcionando y que el `DATABASE_URL` en `.env` sea correcto.

- **Problemas con JWT**:

  - Asegúrate de que el `JWT_SECRET` en `.env` coincida con la clave utilizada para firmar los tokens.

---
