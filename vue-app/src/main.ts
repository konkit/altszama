// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueNumeric from 'vue-numeric';
import Vuex from 'vuex';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

// CSS libs
import 'font-awesome/css/font-awesome.css';
import './assets/main-styles.css';
import './assets/global-styles.css';
import { FrontendConfig, initConfig } from '@/lib/config';

function setupApp(config: FrontendConfig) {
  Vue.use(VueNumeric);
  Vue.use(Vuex);
  router.beforeEach((to, from, next) => {
    document.title = 'Alt Szama';
    store.commit('setCurrentRouteName', to.name);
    store.commit('setDisplayBackButton', to.meta?.backButton ?? false);
    next();
  });

  if (config.sentryUrl) {
    Sentry.init({
      Vue,
      dsn: config.sentryUrl,
      integrations: [new Integrations.BrowserTracing()],
      tunnel: '/api/sentry',

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }

  Vue.config.productionTip = false;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/custom-service-worker.js').then(
        () => {
          console.log('ServiceWorker registered');
        },
        (err) => {
          console.log('ServiceWorker registration failed: ', err);
        },
      );
    });
  }

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    template: '<App/>',
    components: { App },
  });
  // # sourceMappingURL=main.js.map
}

function handleConfigFetchError(err: any) {
  const serviceUnavailableElement = document.getElementById('service-unavailable');
  if (serviceUnavailableElement) {
    serviceUnavailableElement.style.display = 'block';
    setTimeout(() => window.location.reload(), 3000);
  }
}

initConfig().then((config) => setupApp(config), (err) => handleConfigFetchError(err));
