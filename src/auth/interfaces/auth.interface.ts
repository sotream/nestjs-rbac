export interface IUser {
  id?: string;
  email: string;
  password: string;
  roles?: string[];
  permissions?: string[];
}

export interface IAuthResponse {
  id: string;
  email: string;
  access_token: string;
}
