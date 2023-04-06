import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import { Context, JSX } from "solid-js";
import { Auth0State } from "./Auth0State";

/**
 * Props for a component that wraps a protected route in the application, ensuring that the user is authenticated before rendering the content.
 */

export interface ProtectedRouteProps {
  /**
   * The URI to return to after authentication.
   */
  returnTo?: string | (() => string);

  /**
   * The JSX element to display while the user is being redirected to the login page.
   */
  onRedirecting?: JSX.Element;

  /**
   * The options to use when logging in via redirect.
   */
  loginOptions?: RedirectLoginOptions;

  /**
   * The authentication context to use for this protected route.
   */
  context?: Context<Auth0State>;

  /**
   * The child element to render if the user is authenticated.
   */
  children: JSX.Element;
}
