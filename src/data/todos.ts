import { randomUUID } from "crypto";
import { Todo } from "../types/todo";

export const todos: Todo[] = [
  {
    id: 1,
    userId: randomUUID(),
    title: "Lorem ipsum dolor sit ame",
    isCompleted: true,
  },
  {
    id: 2,
    userId: randomUUID(),
    title: "Consectetur adipiscing elit",
    isCompleted: false,
  },
  {
    id: 3,
    userId: randomUUID(),
    title: "Ut enim ad minim veniam",
    isCompleted: true,
  },
  {
    id: 4,
    userId: randomUUID(),
    title: "Duis aute irure dolor in reprehenderit",
    isCompleted: true,
  },
  {
    id: 5,
    userId: randomUUID(),
    title: "Excepteur sint occaecat cupidatat non proident",
    isCompleted: false,
  },
];
