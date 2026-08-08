declare global {
  interface Window {
    __env?: {
      apiBaseUrl: string;
      version: string;
      production: boolean;
      appName?: string;
      authPortalUrl?: string;
      embedFallbackUrl?: string;
    };
  }
}

export const environment = {
  production: window.__env?.production || false,
  apiBaseUrl: window.__env?.apiBaseUrl || 'http://localhost:3000',
  version: window.__env?.version || '0.1.0',
  appName: window.__env?.appName || 'Chat IA',
  authPortalUrl: window.__env?.authPortalUrl || '',
  // Set only for deployments embedded (iframe) by a third-party app. When the
  // login screen loads inside an iframe, it never shows the password form —
  // showing/hiding a form based on whether a submitted email exists would let
  // an attacker probe for account existence. Instead it always shows a
  // "continue in the host app" link to this URL, regardless of the account.
  embedFallbackUrl: window.__env?.embedFallbackUrl || '',
};
