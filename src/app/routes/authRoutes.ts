import express from "express";
import { AuthController } from "../controllers/authController";
import { checkJwt } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBodyMiddleware";
import { UserRegisterSchema } from "../dto/UserRegisterDto";
import { UserLoginSchema } from "../dto/UserLoginDto";

const router = express.Router();
const authController = new AuthController();;


router.post("/register", validateBody(UserRegisterSchema), authController.register.bind(authController));
router.post("/login", validateBody(UserLoginSchema), authController.login.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));
router.post("/logout", checkJwt, authController.logout.bind(authController));
router.post("/delete", checkJwt, authController.delete.bind(authController));
export default router;