import { Auth0Client, LogoutOptions, RedirectLoginOptions, User } from "@auth0/auth0-spa-js";

export interface AuthState<TUser extends User = User> {
  error?: Error;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
  user?: () => TUser | undefined;
}

export interface Auth0State<TUser extends User = User> extends AuthState<TUser> {
  auth0Client: () => Auth0Client | undefined;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => Promise<void>;
  getToken(): Promise<string>;
}
