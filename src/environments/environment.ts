declare global {
  interface Window {
    __env?: {
      apiBaseUrl: string;
      version: string;
      production: boolean;
      appName?: string;
      authPortalUrl?: string;
    };
  }
}

export const environment = {
  production: window.__env?.production || false,
  apiBaseUrl: window.__env?.apiBaseUrl || 'http://localhost:3000',
  version: window.__env?.version || '0.1.0',
  appName: window.__env?.appName || 'Chat IA',
  authPortalUrl: window.__env?.authPortalUrl || '',
};
