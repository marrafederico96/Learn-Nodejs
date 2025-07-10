import express from "express";
import router from "./app/routes/appRoutes";
import cookiePasrse from "cookie-parser";

const app = express();
const port = 3000

app.use(express.static('public'));
app.use(express.json());
app.use(cookiePasrse());
app.use("/", router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})