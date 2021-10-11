import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import Vuex from 'vuex'
import store from "@/store";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vueDebounce from 'vue-debounce'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import VModal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PortalVue)
Vue.use(Vuex)
Vue.use(vueDebounce, {
  defaultTime: '500ms'
})
Vue.use(VModal)

Vue.component('v-select', vSelect)

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
