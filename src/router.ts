import Vue from 'vue';
import Router, { NavigationGuard } from 'vue-router';
import NewExpense from './expenses/new/NewExpense.vue';
import ListExpenses from './expenses/list/ListExpenses.vue';
import Login from './user/Login.vue';
import Register from './user/Register.vue';
import Statistics from './expenses/statistics/Statistics.vue';
import store from './store';

Vue.use(Router);

const authGuard: NavigationGuard<Vue> = (to, fom, next) => {
  if (!store.state.token) {
    next('/login');
  } else {
    next();
  }
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'default',
      component: NewExpense,
      beforeEnter: authGuard,
    },
    {
      path: '/expenses/new',
      name: 'new',
      component: NewExpense,
      beforeEnter: authGuard,
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ListExpenses,
      beforeEnter: authGuard,
    },
    {
      path: '/expenses/statistics',
      name: 'statistics',
      component: Statistics,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
  ],
});
