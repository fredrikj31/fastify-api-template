import z from "zod";

export const TodoSchema = z.object({
  id: z.number().describe("Id of the todo, typed as an integer"),
  userId: z
    .string()
    .uuid()
    .describe("Unique identifier of a user who owns the todo"),
  title: z.string().describe("Title which describes the todo"),
  isCompleted: z
    .boolean()
    .default(false)
    .describe("Shows the status of the todo"),
});

export type Todo = z.infer<typeof TodoSchema>;
