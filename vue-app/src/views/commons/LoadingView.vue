<template>
  <div>
    <div v-if="loading === true">
      <errors-component />

      <div class="loader">Loading ....</div>
    </div>

    <div v-if="loading === false">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ErrorsComponent from './ErrorsComponent.vue';

@Component({
  components: {
    ErrorsComponent,
  },
})
export default class LoadingView extends Vue {
  created() {
    this.$store.commit('clearErrors');
    this.$store.commit('setLoadingTrue');
  }

  get loading() {
    return this.$store.state.loading;
  }
}
</script>

<style scoped>
.loader,
.loader:before,
.loader:after {
  background: #e9ecef;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}

.loader {
  color: #e9ecef;
  text-indent: -9999em;
  margin: 88px auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: "";
}

.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.loader:after {
  left: 1.5em;
}

@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}

@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
