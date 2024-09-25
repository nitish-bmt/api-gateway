export interface JwtPayload{
  userId: string;
  username: string;
  roleId: number;
}

export interface userEmbeddedRequest extends Request{
  user: JwtPayload;
}

export interface StandardResponse{
  status: number;
  success: boolean;
  message: string;
  response?: any;
}