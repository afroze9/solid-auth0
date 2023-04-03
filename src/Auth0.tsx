import { LogoutOptions, RedirectLoginOptions, User, createAuth0Client } from "@auth0/auth0-spa-js"
import { createContext, createResource, createSignal, mergeProps, useContext } from "solid-js";
import { Auth0Props, Auth0State } from "./@types";

export const Auth0Context = createContext<Auth0State>();
export const useAuth0 = <TUser extends User = User>(
  context = Auth0Context
): Auth0State<User> => useContext(context) as Auth0State<User>;

const isRedirect = (url: string) => {
  const [, query] = url.split('?');
  return query && query.includes('code=') && query.includes('state=');
}

const getUrl = () => {
  return window.location.href;
}

const onLogin = (_appState: any, loginRedirectUri: string) => {
  window.history.replaceState(undefined, '', loginRedirectUri);
}

export const Auth0 = (props: Auth0Props) => {
  props = mergeProps(
    {},
    {
      onLogin: onLogin,
      getUrl: getUrl
    },
    props
  );

  const auth0ClientPromise = createAuth0Client({
    domain: props.domain,
    clientId: props.clientId,
    authorizationParams: {
      audience: props.audience,
      redirect_uri: props.loginRedirectUri,
      scope: props.scope,
    },
  });

  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean | undefined>(undefined);
  const [user, setUser] = createSignal<User>();

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

  return (
    <Auth0Context.Provider
      value={{
        auth0Client: auth0Client,
        isLoading: () => isAuthenticated() === undefined,
        isAuthenticated: () => !!isAuthenticated(),
        user: user,
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