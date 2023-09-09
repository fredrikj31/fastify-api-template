import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { TodoSchema } from "../../types/todo";
import { todos as todosData } from "../../data/todos";
import { ErrorSchema } from "../../types/error";

export const todos: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/",
    {
      schema: {
        response: {
          "200": z.array(TodoSchema).describe("Returns a list of all todos"),
        },
        tags: ["todos"],
        summary:
          "Gets all todos which are currently available, returned in an array",
        description: "Fetches all todos",
      },
    },
    async (_, res) => {
      res.status(200).send(todosData);
    }
  );

  app.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().describe("Id of the todo you want to get"),
        }),
        response: {
          "404": ErrorSchema.describe(
            "No todo with the specified id was found"
          ),
          "200": TodoSchema.describe("Returns the specified todo"),
        },
        tags: ["todos"],
        description: "Fetch single todo by id",
        summary: "Gets specific todo by it's id, and returns the content of it",
      },
    },
    async (req, res) => {
      const selectedTodo = todosData.find(
        (todo) => todo.id === parseInt(req.params.id)
      );

      if (selectedTodo === undefined) {
        return res.status(404).send({
          code: "todo-not-found",
          message: "We couldn't find a todo with that id.",
        });
      }

      return res.status(200).send(selectedTodo);
    }
  );

  app.post(
    "/",
    {
      schema: {
        body: TodoSchema.omit({ id: true }).describe(
          "Returns the specified todo"
        ),
        response: {
          "200": TodoSchema.describe("Returns the specified todo"),
        },
        tags: ["todos"],
        description: "Creates a todo",
        summary:
          "Creates a todo with specific properties, it generates the id automatically",
      },
    },
    async (req, res) => {
      const newTodoId = todosData.length + 1;

      return res.status(200).send({
        id: newTodoId,
        userId: req.body.userId,
        title: req.body.title,
        isCompleted: req.body.isCompleted,
      });
    }
  );

  app.patch(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: TodoSchema.partial().describe("Returns the specified todo"),
        response: {
          "200": TodoSchema.describe("Returns the specified todo"),
          "404": ErrorSchema.describe(
            "No todo with the specified id was found"
          ),
        },
        tags: ["todos"],
        description: "Updates specific todo by id",
        summary:
          "Updates a todo by it's id, and only updates the specified properties",
      },
    },
    async (req, res) => {
      const todoId = req.params.id;
      const currentTodo = todosData.find(
        (todo) => todo.id === parseInt(todoId)
      );

      if (!currentTodo) {
        return res.status(404).send({
          code: "todo-not-found",
          message: "This specified todo was not found",
        });
      }

      const updatedTodoVariables = req.body;
      const updatedTodo = { ...currentTodo, ...updatedTodoVariables };

      return res.status(200).send(updatedTodo);
    }
  );

  app.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          "404": ErrorSchema.describe(
            "No todo with the specified id was found"
          ),
          "200": TodoSchema.describe("Returns the specified todo"),
        },
        tags: ["todos"],
        description: "Deletes a single todo",
        summary: "Deletes a single todo by specifying it's id",
      },
    },
    async (req, res) => {
      const todoId = req.params.id;
      const todo = todosData.find((todo) => todo.id === parseInt(todoId));

      if (!todo) {
        return res.status(404).send({
          code: "todo-not-found",
          message: "This specified todo was not found",
        });
      }

      return res.status(200).send(todo);
    }
  );
};
