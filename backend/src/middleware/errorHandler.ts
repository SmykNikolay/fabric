import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";

// Абстрактный класс для обработчиков ошибок
abstract class ErrorHandler {
  protected nextHandler?: ErrorHandler;

  setNext(handler: ErrorHandler): ErrorHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(err: any, req: Request, res: Response, next: NextFunction): void {
    if (this.nextHandler) {
      this.nextHandler.handle(err, req, res, next);
    } else {
      this.defaultHandle(err, req, res, next);
    }
  }

  protected abstract defaultHandle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;
}

// Конкретный обработчик для ошибок валидации
class ValidationErrorHandler extends ErrorHandler {
  protected defaultHandle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: err.message });
    } else {
      super.handle(err, req, res, next);
    }
  }
}

// Конкретный обработчик для ошибок авторизации
class UnauthorizedErrorHandler extends ErrorHandler {
  protected defaultHandle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (err.name === "UnauthorizedError") {
      res.status(401).send({ message: "Unauthorized" });
    } else {
      super.handle(err, req, res, next);
    }
  }
}

// Конкретный обработчик для логирования ошибок
class LoggingErrorHandler extends ErrorHandler {
  protected defaultHandle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    console.error(err.stack);

    const logFilePath = path.join(__dirname, "error.log");
    const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;
    fs.appendFileSync(logFilePath, logMessage);

    super.handle(err, req, res, next);
  }
}

// Конкретный обработчик для всех остальных ошибок
class GeneralErrorHandler extends ErrorHandler {
  protected defaultHandle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    res.status(500).send({ message: "An unexpected error occurred" });
  }
}

// Экспортируем функцию для создания цепочки обработчиков
export function createErrorHandlerChain(): ErrorHandler {
  const loggingHandler = new LoggingErrorHandler();
  const validationHandler = new ValidationErrorHandler();
  const unauthorizedHandler = new UnauthorizedErrorHandler();
  const generalHandler = new GeneralErrorHandler();

  loggingHandler
    .setNext(validationHandler)
    .setNext(unauthorizedHandler)
    .setNext(generalHandler);

  return loggingHandler;
}

