import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { singoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(singoutRouter);
app.use(signupRouter);

app.use(errorHandler)

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
