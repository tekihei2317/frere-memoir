import { router } from "../trpc/initialize";
import { getUser } from "./get-user";
import { login } from "./login";
import { register } from "./register";

export const authRouter = router({
  login,
  register,
  user: getUser,
});
