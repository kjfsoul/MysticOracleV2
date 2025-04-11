import winston from 'winston';

export class Logger {
  private logger: winston.Logger;

  constructor(service: string) {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service },
      transports: [
        new winston.transports.File({ 
          filename: 'cline_docs/agent-logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'cline_docs/agent-logs/combined.log' 
        })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}