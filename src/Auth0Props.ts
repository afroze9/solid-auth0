import { JSX } from 'solid-js';

/**
 * Props for configuring the Auth0 authentication provider.
 */
export type Auth0Props = {
  /**
   * The children of the Auth0 component. These will be rendered as-is.
   */
  children: JSX.Element;

  /**
   * The Auth0 domain used for authentication.
   */
  domain: string;

  /**
   * The Auth0 audience to authenticate against.
   */
  audience?: string;

  /**
   * The client ID for the Auth0 application.
   */
  clientId: string;

  /**
   * The scope of the authentication request.
   */
  scope: string;

  /**
   * The URL to redirect to after a successful login.
   */
  loginRedirectUri: string;

  /**
   * The URL to redirect to after a logout.
   */
  logoutRedirectUri: string;

  /**
   * Optional function that returns the URL to redirect to after a login.
   */
  getUrl?: () => string;

  /**
   * Optional function to be called after a successful login.
   */
  onLogin?: (appState: any, loginRedirectUri: string) => void;
};
