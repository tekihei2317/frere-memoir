export type Customer = {
  email: string;
  name: string;
};

export type AdminUser = {
  email: string;
};

export type FrereUser = ({ type: "customer" } & Customer) | ({ type: "admin" } & AdminUser);

/**
 * ログインする
 */
export type LoginWorkflow<LoginInput> = {
  input: LoginInput;
  output: Promise<FrereUser>;
  deps: {
    // メールアドレスが存在するか、メールアドレスガ認証済みか、パスワードが正しいかを確認する
    validateLoginInput: (input: LoginInput) => Promise<FrereUser>;
    saveUserToSession: (user: FrereUser) => Promise<void>;
  };
};

/**
 * ユーザー登録する
 */
export type RegisterWorkflow<RegisterInput> = {
  input: RegisterInput;
  output: Promise<Customer>;
  deps: {
    validateRegisterInput: (input: RegisterInput) => Promise<RegisterInput>;
    persistCustomer: (input: RegisterInput) => Promise<Customer>;
    sendVerificationEmail: (user: Customer) => Promise<void>;
  };
};

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
