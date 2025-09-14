import { format, createLogger, transports } from "winston";
import { key } from "./key";
require("winston-mongodb");

const { combine, timestamp, prettyPrint, label, colorize } = format;

const logger = createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss"}), 
    prettyPrint(({ level, message, timestamp}) => {
      return `${timestamp} [${level}] ${message}`
    })
  ),
  defaultMeta: { service: "product-service" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combine.log" }),
    new transports.MongoDB({
      db: key.MONGO_URL, 
      collection: "logs"
    })
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.MongoDB({
      db: key.MONGO_URL,
      options: {},
      collection: "exceptions"
    })
  ],
  rejectionHandlers: [
    new transports.Console(),
    new transports.MongoDB({
      db: key.MONGO_URL,
      options: {},
      collection: "rejections"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({ format: format.simple() }));
}

export { logger as Logger }