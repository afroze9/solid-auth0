import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import { Component, Context, JSX, createEffect } from "solid-js";
import { Auth0State } from "./@types";
import { Auth0Context, useAuth0 } from "./Auth0";

const defaultOnRedirecting = (): JSX.Element => <></>;

const defaultReturnTo = (): string => `${window.location.pathname}${window.location.search}`;

export interface WithAuthenticationRequiredOptions {
  returnTo?: string | (() => string);
  onRedirecting?: () => JSX.Element;
  loginOptions?: RedirectLoginOptions;
  context?: Context<Auth0State>;
}

export const withAuthenticationRequired = <P extends object>(
  /* tslint:disable-next-line */
  Component: Component<P>,
  options: WithAuthenticationRequiredOptions = {}
) => {

  return (props: P): JSX.Element => {
    const {
      returnTo = defaultReturnTo,
      onRedirecting = defaultOnRedirecting,
      loginOptions,
      context = Auth0Context,
    } = options;

    const auth0 = useAuth0();

    createEffect(() => {
      if (auth0?.isLoading() || auth0?.isAuthenticated()) {
        return;
      }

      const opts = {
        ...loginOptions,
        appState: {
          ...(loginOptions && loginOptions.appState),
          returnTo: typeof returnTo === 'function' ? returnTo() : returnTo,
        },
      };

      (async (): Promise<void> => {
        await auth0?.loginWithRedirect(opts);
      })();

    });

    return auth0?.isAuthenticated() ? <Component {...props} /> : onRedirecting();
  }
}
