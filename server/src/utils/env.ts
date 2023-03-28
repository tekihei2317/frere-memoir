import { envsafe, str } from "envsafe";

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  COOKIE_PASSWORD: str({
    devDefault: "J0V3YQfHQWwvF5LfhrtGf4PVnfX1NEJf",
  }),
  ADMIN_EMAIL: str({
    devDefault: "test@example.com",
  }),
  ADMIN_PASSWORD: str({
    devDefault: "pass1234",
  }),
});
