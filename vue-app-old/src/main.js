// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import VueNumeric from 'vue-numeric'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueNumeric);

// CSS libs
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css';
import './assets/main-styles.css'

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

if (typeof process.env.sentryURL !== "undefined") {
  Raven
    .config(process.env.sentryURL)
    .addPlugin(RavenVue, Vue)
    .install();

}

Vue.config.productionTip = false

Vue.config.errorHandler = function (err, vm, info) {
  console.log("err", err)

  if (typeof process.env.sentryURL !== "undefined") {
    Raven.captureException(err)
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/custom-service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
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
})
