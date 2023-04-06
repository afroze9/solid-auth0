import { LogoutOptions, RedirectLoginOptions, User, createAuth0Client } from "@auth0/auth0-spa-js"
import { JSX, createContext, createResource, createSignal, mergeProps, useContext } from "solid-js";
import { Auth0Props } from "./Auth0Props";
import { Auth0State } from "./Auth0State";

export const Auth0Context = createContext<Auth0State>();
export const useAuth0 = <TUser extends User = User>(
  context = Auth0Context
): Auth0State<User> => useContext(context) as Auth0State<User>;

/**
 * Checks if a URL is a redirect callback from Auth0 by checking for the presence of 'code' and 'state' parameters in the URL query.
 * @param {string} url - The URL to check.
 * @returns {boolean} - Returns true if the URL is a redirect callback from Auth0 and false otherwise.
 */
const isRedirect = (url: string) => {
  const [, query] = url.split('?');
  return query && query.includes('code=') && query.includes('state=');
}

/**
 * Returns the current URL.
 * @returns {string} - The current URL.
 */
const getUrl = () => {
  return window.location.href;
}

/**
 * Updates the URL in the browser history to remove any query parameters after an Auth0 login redirect.
 * @param {any} _appState - Unused.
 * @param {string} loginRedirectUri - The URI to redirect to after logging in.
 */
const onLogin = (_appState: any, loginRedirectUri: string) => {
  window.history.replaceState(undefined, '', loginRedirectUri);
}

/**
 * Component that provides authentication using Auth0.
 * @param props The props for the component.
 * @returns The rendered component.
 */
export const Auth0 = (props: Auth0Props): JSX.Element => {
  // Merge props with defaults
  props = mergeProps(
    {},
    {
      onLogin,
      getUrl
    },
    props
  );

  // Create the Auth0 client promise that resolves to an instance
  const auth0ClientPromise = createAuth0Client({
    domain: props.domain,
    clientId: props.clientId,
    authorizationParams: {
      audience: props.audience,
      redirect_uri: props.loginRedirectUri,
      scope: props.scope,
    },
  });

  // Create signals for the user and authentication status
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean | undefined>(undefined);
  const [user, setUser] = createSignal<User>();

  // Create a resource for the Auth0 client instance
  const [auth0Client] = createResource(async () => {
    const client = await auth0ClientPromise;
    const url = props.getUrl!();

    if (isRedirect(url)) {
      const result = await client.handleRedirectCallback(url);
      props.onLogin!(result.appState, props.loginRedirectUri);
    }

    if (setIsAuthenticated(await client.isAuthenticated())) {
      setUser(await client.getUser());
    }

    return client;
  });

  // Render the component
  return (
    <Auth0Context.Provider
      value={{
        auth0Client,
        isLoading: () => isAuthenticated() === undefined,
        isAuthenticated: () => !!isAuthenticated(),
        user,
        loginWithRedirect: async (options?: RedirectLoginOptions) => {
          const client = await auth0ClientPromise;
          client.loginWithRedirect({
            authorizationParams: {
              redirect_uri: props.loginRedirectUri,
              audience: props.audience,
              scope: props.scope,
              ...options
            }
          })
        },
        logout: async (options?: LogoutOptions) => {
          const client = await auth0ClientPromise;
          client.logout({
            logoutParams: {
              returnTo: props.logoutRedirectUri,
              ...options
            }
          })
        },
        getToken: async () => {
          const client = await auth0ClientPromise;
          return await client.getTokenSilently();
        }
      }}
    >
      {props.children}
    </Auth0Context.Provider>
  )
}