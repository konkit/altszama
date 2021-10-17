export interface FrontendConfig {
  currentDomain: string;
  vapidPublicKey: string;
  googleClientId: string;
  sentryUrl: string;
}

let config: FrontendConfig;

export function initConfig(): Promise<FrontendConfig> {
  return new Promise((resolve, reject) => {
    const CURRENT_DOMAIN = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
    const CONFIG_URL = `${CURRENT_DOMAIN}/api/frontendConfig`;

    fetch(CONFIG_URL)
      .then((response) => {
        console.log('Response: ', response);
        if (response.ok) {
          return response.json();
        }
        console.log('Unknown error occured', response);
        throw new Error('Unknown error occured');
      }, (err) => reject(err))
      .then((response) => {
        config = {
          currentDomain: CURRENT_DOMAIN,
          googleClientId: response.googleClientId,
          vapidPublicKey: response.vapidPublicKey,
          sentryUrl: response.sentryUrl,
        };

        resolve(config);
      }, (err) => reject(err));
  });
}

export function getConfig(): FrontendConfig {
  return config;
}
