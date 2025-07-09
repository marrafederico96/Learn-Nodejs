import express from "express";
import router from "./app/routes/authRoutes";

const app = express();
const port = 3000

app.use(express.static('public'));
app.use(express.json());

app.use("/auth", router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})