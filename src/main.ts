import 'reflect-metadata';
import Vue from 'vue';
import './plugins/vuetify';
import VueTypedi from 'vue-typedi';
import VueLoading from 'vue-loading-template';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import moment from 'moment';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueTypedi);
Vue.use(VueLoading);
Vue.use(BootstrapVue);

Vue.filter('formatDate', (val: string) => moment(val).format('DD-MM-YYYY'));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
