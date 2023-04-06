import { JSX, createEffect } from "solid-js";
import { useAuth0 } from "./Auth0";
import { ProtectedRouteProps } from "./ProtectedRouteProps";

const defaultOnRedirecting: JSX.Element = <>Loading...</>;

const defaultReturnTo = (): string => `${window.location.pathname}${window.location.search}`;

/**
 * Component that wraps a protected route in the application, ensuring that the user is authenticated before rendering the content.
 * @param {ProtectedRouteProps} props - Props for the component.
 * @returns {(() => JSX.Element) | JSX.Element} - The protected route or a redirecting element.
*/
export const Protected = (props: ProtectedRouteProps): JSX.Element => {
  const auth0 = useAuth0();
  const onRedirecting = props.onRedirecting || defaultOnRedirecting;
  const returnTo = props.returnTo || defaultReturnTo;

  createEffect(() => {
    if (auth0?.isLoading() || auth0?.isAuthenticated()) {
      return;
    }

    const opts = {
      ...props.loginOptions,
      appState: {
        ...(props.loginOptions && props.loginOptions.appState),
        returnTo: typeof returnTo === 'function' ? returnTo() : returnTo,
      },
    };

    (async (): Promise<void> => {
      await auth0?.loginWithRedirect(opts);
    })();

  });

  return auth0?.isAuthenticated() ? props.children : onRedirecting;
}
