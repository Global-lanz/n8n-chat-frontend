// Declaração do tipo para window.__env
declare global {
  interface Window {
    __env?: {
      apiBaseUrl: string;
      version: string;
      production: boolean;
    };
  }
}

export const environment = {
  production: window.__env?.production || true,
  apiBaseUrl: window.__env?.apiBaseUrl || 'http://localhost:3000',
  version: window.__env?.version || '0.1.0'
};
