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
};