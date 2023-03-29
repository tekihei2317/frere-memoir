import { router } from "../trpc/initialize";
import { getUser } from "./get-user";
import { login } from "./login";
import { register } from "./register";
import { logout } from "./logout";

export const authRouter = router({
  login,
  register,
  logout,
  user: getUser,
});
