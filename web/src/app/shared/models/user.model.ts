export interface BaseUser {
  email: string;
  password: string;
}

export interface UserPassword {
  password: string;
}

export interface User {
  userId: number;
  email: string;
  token: string;
}

export interface UserLogin {
  message: string;
  success: boolean;
  user?: User;
}
