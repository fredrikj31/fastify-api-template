import pino from "pino";

export const logger = pino({
  messageKey: "message",
  errorKey: "error",
  formatters: {
    level: (label: string) => {
      return {
        level: label.toUpperCase(),
      };
    },
  },
  level: "debug",
});
