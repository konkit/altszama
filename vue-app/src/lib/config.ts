declare global {
  interface Window { _env?: any }
}

export const CURRENT_DOMAIN = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

export const VAPID_PUBLIC_KEY = window._env?.VUE_APP_VAPID_PUBLIC_KEY || process.env.VUE_APP_VAPID_PUBLIC_KEY;
export const GOOGLE_CLIENT_ID = window._env?.VUE_APP_GOOGLE_CLIENT_ID || process.env.VUE_APP_GOOGLE_CLIENT_ID;
export const SENTRY_URL = window._env?.VUE_APP_SENTRY_URL || process.env.VUE_APP_SENTRY_URL;
