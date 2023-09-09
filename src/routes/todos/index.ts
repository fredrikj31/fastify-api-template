import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { TodoSchema } from "../../types/todo";
import { todos as todosData } from "../../data/todos";

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
          "404": z
            .object({
              code: z.string(),
              message: z.string(),
            })
            .describe("No todo with the specified id was found"),
          "200": TodoSchema.describe("Returns the specified todo"),
        },
        tags: ["todos"],
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
        body: z.object({
          userId: z.string().uuid(),
          title: z.string(),
          isCompleted: z.boolean(),
        }),
        response: {
          "200": z.object({
            id: z.number(),
            userId: z.string().uuid(),
            title: z.string(),
            isCompleted: z.boolean(),
          }),
        },
        tags: ["todos"],
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
        body: z
          .object({
            userId: z.string().uuid(),
            title: z.string(),
            isCompleted: z.boolean(),
          })
          .partial(),
        response: {
          "200": z.object({
            id: z.number(),
            userId: z.string().uuid(),
            title: z.string(),
            isCompleted: z.boolean(),
          }),
          "404": z.object({
            code: z.string(),
            message: z.string(),
          }),
        },
        tags: ["todos"],
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
          "404": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.object({
            id: z.number(),
            userId: z.string().uuid(),
            title: z.string(),
            isCompleted: z.boolean(),
          }),
        },
        tags: ["todos"],
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
