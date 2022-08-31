export interface LoggedUser {
  id: number;
  username: string;
  email: string;
  roles: any[];
  accessToken: string;
  tokenType: string;
}
