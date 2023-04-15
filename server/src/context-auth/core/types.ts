export type Customer = {
  id: number;
  email: string;
  name: string;
};

export type AdminUser = {
  email: string;
};

export type FrereUser = ({ type: "customer" } & Customer) | ({ type: "admin" } & AdminUser);

/**
 * メールを確認する
 */
export type VerifyEmailWorkflow = {
  input: string; // token
  output: void;
  deps: {
    verifyEmail: (token: string) => Promise<void>;
    saveUserToSession: (user: Customer) => Promise<void>;
  };
};
