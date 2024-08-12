import { AppDataSource } from "./data-source";
import * as express from "express";
import { createErrorHandlerChain } from "./middleware/errorHandler";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";

// import { userRouter } from "./routes/user.routes";

import "reflect-metadata";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const errorHandlerChain = createErrorHandlerChain();
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandlerChain.handle(err, req, res, next);
});

const { PORT = 3000 } = process.env;
// app.use("/auth", userRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
