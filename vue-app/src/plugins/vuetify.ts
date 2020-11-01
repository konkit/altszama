import Vue from 'vue'
import Vuetify from 'vuetify'
import {
  VCol,
  VRow,
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VCol,
    VRow,
  },
})

const vuetify = new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#42a5f6',
        secondary: '#050b1f',
        accent: '#204165',
      },
      dark: {},
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});

export default vuetify;
