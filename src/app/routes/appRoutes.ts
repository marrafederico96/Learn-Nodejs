import express from "express";
import { AuthController } from "../controllers/authController";
import { checkJwt } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBodyMiddleware";
import { UserRegisterSchema } from "../dto/UserRegisterDto";
import { UserLoginSchema } from "../dto/UserLoginDto";
import { FriendshipController } from "../controllers/friendshipController";
import { FriendshipReceiveSchema } from "../dto/FriendshipReceiveDto";

const router = express.Router();
const authController = new AuthController();;
const friendshipController = new FriendshipController();

router.post("/auth/register", validateBody(UserRegisterSchema), authController.register.bind(authController));
router.post("/auth/login", validateBody(UserLoginSchema), authController.login.bind(authController));
router.post("/auth/refresh", authController.refresh.bind(authController));
router.post("/auth/logout", checkJwt, authController.logout.bind(authController));
router.post("/auth/delete", checkJwt, authController.delete.bind(authController));

router.post("/user/add-friend", checkJwt, validateBody(FriendshipReceiveSchema), friendshipController.addFriend.bind(friendshipController));
export default router;