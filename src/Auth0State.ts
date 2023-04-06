import { Auth0Client, LogoutOptions, RedirectLoginOptions, User } from '@auth0/auth0-spa-js';

interface AuthState<TUser extends User = User> {
  error?: Error;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
  user?: () => TUser | undefined;
}

/**
 * Represents the state of an Auth0 authentication provider instance, including functions for authentication and token management.
 * @template TUser The type of the user object returned by the authentication provider.
 */
export interface Auth0State<TUser extends User = User> extends AuthState<TUser> {
  /**
   * A function that returns the Auth0 client instance, or `undefined` if it is not yet initialized.
   */
  auth0Client: () => Auth0Client | undefined;

  /**
   * Initiates the login process, redirecting the user to the Auth0 login page.
   * @param options Optional configuration for the login request.
   */
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;

  /**
   * Logs the user out of the Auth0 session.
   * @param options Optional configuration for the logout request.
   */
  logout: (options?: LogoutOptions) => Promise<void>;

  /**
   * Returns the authentication token for the user.
   * @returns A promise that resolves to the authentication token for the user.
   */
  getToken(): Promise<string>;
}
