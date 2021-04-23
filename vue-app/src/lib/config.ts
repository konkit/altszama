interface FrontendConfig {
  currentDomain: string;
  vapidPublicKey: string;
  googleClientId: string;
  sentryUrl: string;
}

let config: FrontendConfig;

export function initConfig(): Promise<FrontendConfig> {
  return new Promise(resolve => {
    const CURRENT_DOMAIN = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    const CONFIG_URL = CURRENT_DOMAIN + "/api/frontendConfig";

    fetch(CONFIG_URL)
        .then(response => response.json())
        .then(response => {
          config = {
            currentDomain: CURRENT_DOMAIN,
            googleClientId: response.googleClientId,
            vapidPublicKey: response.vapidPublicKey,
            sentryUrl: response.sentryUrl,
          };

          resolve(config)
        })
  });
}

export function getConfig(): FrontendConfig {
  return config;
}
