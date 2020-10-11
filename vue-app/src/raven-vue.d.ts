declare module 'raven-js/plugins/vue' {
  import Vue from 'vue';
  import { RavenStatic } from 'raven-js';
  function vuePlugin(raven: RavenStatic, vue: Vue): RavenStatic;
  export = vuePlugin;
}