import 'reflect-metadata';
import Vue from 'vue';
import VueTypedi from 'vue-typedi';
import VueLoading from 'vue-loading-template';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueTypedi);
Vue.use(VueLoading);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
