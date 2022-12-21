import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({
      filename: `${process.env.LOG_DIRECTORY || "."}/error.log`,
      level: "error",
    }),
    new transports.File({
      filename: `${process.env.LOG_DIRECTORY || "."}/combined.log`,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
