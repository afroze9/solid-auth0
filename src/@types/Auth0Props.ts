import { JSX } from "solid-js";

export type Auth0Props = {
  children: JSX.Element;
  domain: string;
  audience?: string;
  clientId: string;
  scope: string;
  loginRedirectUri: string;
  logoutRedirectUri: string;
  getUrl?: () => string;
  onLogin?: (appState: any, loginRedirectUri: string) => void;
}
