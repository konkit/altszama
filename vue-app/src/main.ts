// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueNumeric from "vue-numeric";
import vuetify from "./plugins/vuetify";

import Vuex from "vuex";
// CSS libs
import "font-awesome/css/font-awesome.css";
import "./assets/main-styles.css";
import "./assets/global-styles.css";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import {initConfig} from "@/lib/config";

initConfig().then(config => {
    Vue.use(VueNumeric);
    Vue.use(Vuex);
    router.beforeEach(function (to, from, next) {
        document.title = "Alt Szama";
        store.commit("setCurrentRouteName", to.name)
        store.commit("setDisplayBackButton", to.meta.backButton)
        next();
    });

    if (config.sentryUrl) {
        Sentry.init({
            Vue,
            dsn: config.sentryUrl,
            integrations: [new Integrations.BrowserTracing()],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
    }


    Vue.config.productionTip = false;

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("/custom-service-worker.js").then(
                function (registration) {
                    console.log("ServiceWorker registered")
                },
                function (err) {
                    console.log("ServiceWorker registration failed: ", err);
                }
            );
        });
    }


    /* eslint-disable no-new */
    new Vue({
        el: "#app",
        router: router,
        store: store,
        vuetify: vuetify,
        template: "<App/>",
        components: {App: App}
    });
    //# sourceMappingURL=main.js.map
});
