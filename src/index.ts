import express, { Request, Response, Application } from "express";

import MongoConnect from "./db";
import reservationsRouter from "./routes/reservations.router";
import usersRouter from "./routes/users.router";
import storesRouter from "./routes/stores.router"
import bodyParser from "body-parser";

const app : Application = express();

MongoConnect()

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

// life check
app.get("/", (request: Request, response: Response) => { 
  response.status(200).json({});
}); 

app.use('/reservations', reservationsRouter);
app.use('/users', usersRouter);
app.use('/stores', storesRouter);

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});

export default app