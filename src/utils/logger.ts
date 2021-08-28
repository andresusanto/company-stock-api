import winston from "winston";
import config from "@src/utils/config";

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});
