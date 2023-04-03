# SolidJS Auth0 Wrapper

A SolidJS implementation for Auth0 using the package `@auth0/auth0-spa-js`. This work is based on top of the library created by [@rturnq](https://github.com/rturnq/solid-auth0) (which hasn't been updated in a few years).

# Getting Started

## Installation

### NPM

```
npm i @afroze9/solidjs-auth0
```

### PNPM

```
pnpm add @afroze9/solidjs-auth0
```

### Yarn

```
npm add @afroze9/solidjs-auth0
```

## Usage

### At the root of your app

Note: Please ensure you have an SPA setup in Auth0 to configure the context.

```tsx
import { Auth0 } from '@afroze9/solidjs-auth0';

const App: Component = () => {
  return (
    <Auth0
      domain="_auth0_domain_"
      clientId="_client_id_"
      audience="_api_audience_"
      logoutRedirectUri={`${window.location.origin}/`}
      loginRedirectUri={`${window.location.origin}/`}
      scope="_scopes_"
    >
      <AppComponent />
    </Auth0>
  );
};
```

### Elsewhere in the app

```tsx
import { Auth0State, useAuth0 } from '@afroze9/solidjs-auth0';

const TopNav: Component = () => {
  const auth0: Auth0State<User> | undefined = useAuth0();

  return <div>{auth0?.isAuthenticated() ? <div>Logout</div> : <div>Login</div>}</div>;
};
```

### To secure a route

```tsx
import { withAuthenticationRequired } from '@afroze9/solidjs-auth0';

const MyPage: Component = () => {
  return <div>This is a secure route</div>;
};

// You can pass any component to onRedirecting
export default withAuthenticationRequired(MyPage, {
  onRedirecting: () => <>Loading</>,
});
```

# Notes

Currently the wrapper only supports a few underlying functions/properties from the original `@auth0/auth0-spa-js` package. Future plan is to add more functionality.
