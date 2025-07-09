import express from "express";
import { AuthController } from "../controllers/authController";
import { checkJwt } from "../middleware/authMiddleware";

const router = express.Router();
const authController = new AuthController();;


router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", checkJwt, authController.logout.bind(authController));
router.post("/delete", checkJwt, authController.delete.bind(authController));
export default router;