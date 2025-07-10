import express from "express";
import { AuthController } from "../controllers/authController";
import { checkJwt } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBodyMiddleware";
import { UserLoginSchema, UserRegisterSchema } from "../dto/UserDto";
import { FriendshipController } from "../controllers/friendshipController";
import { FriendshipUsernameSchema } from "../dto/FriendshipDto";
import { GroupNameSchema } from "../dto/GroupDto";
import { GroupController } from "../controllers/groupController";

const router = express.Router();
const authController = new AuthController();;
const friendshipController = new FriendshipController();
const groupController = new GroupController();

//Endpoint auth user
router.post("/auth/register", validateBody(UserRegisterSchema), authController.register.bind(authController));
router.post("/auth/login", validateBody(UserLoginSchema), authController.login.bind(authController));
router.post("/auth/refresh", authController.refresh.bind(authController));
router.post("/auth/logout", checkJwt, authController.logout.bind(authController));
router.delete("/auth/delete", checkJwt, authController.delete.bind(authController));

//endpoint friendship
router.post("/user/add-friend", checkJwt, validateBody(FriendshipUsernameSchema), friendshipController.addFriend.bind(friendshipController));
router.delete("/user/remove-friend", checkJwt, validateBody(FriendshipUsernameSchema), friendshipController.deleteFriend.bind(friendshipController));
router.post("/user/accept-request", checkJwt, validateBody(FriendshipUsernameSchema), friendshipController.accept.bind(friendshipController));
router.delete("/user/decline-request", checkJwt, validateBody(FriendshipUsernameSchema), friendshipController.deleteFriend.bind(friendshipController));


//endpoint group
router.post("/user/group/create", checkJwt, validateBody(GroupNameSchema), groupController.create.bind(groupController));
router.delete("/user/group/delete", checkJwt, validateBody(GroupNameSchema), groupController.delete.bind(groupController));
export default router;