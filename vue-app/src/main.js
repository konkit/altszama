// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueNumeric from 'vue-numeric'
import './plugins/vuetify'

Vue.use(VueResource);
Vue.use(VueNumeric);

// CSS libs
import 'font-awesome/css/font-awesome.css';
import './assets/main-styles.css'

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

if (process.env.VUE_APP_SENTRY_URL) {
  Raven
    .config(process.env.VUE_APP_SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install();

}

Vue.config.productionTip = false;

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info);
  if (process.env.VUE_APP_SENTRY_URL) {
    const options = {
      extra: {
        state: JSON.stringify(store.state)
      }
    };

    Raven.captureException(err, options)
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/custom-service-worker.js').then(registration => {
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
