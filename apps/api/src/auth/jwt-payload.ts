// Claims carried by access tokens: signed on login, read back by the auth guard.
export interface JwtPayload {
  sub: string;
  email: string;
}
