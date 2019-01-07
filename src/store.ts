import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);
const vuexPersist = new VuexPersist({
  key: 'mwallet',
  storage: localStorage,
});

export interface AppState {
  token: string;
  user: string;
  income: number;
  isLoading: boolean;
  dateFormat: string;
}

export default new Vuex.Store<AppState>({
  state: {
    token: '',
    user: '',
    income: 0,
    isLoading: false,
    dateFormat: 'MM-DD-YYYY',
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = '';
    },
    setUser(state, user: string) {
      state.user = user;
    },
    setIncome(state, income: number) {
      state.income = income;
    },
  },
  actions: {

  },
  plugins: [vuexPersist.plugin],
});
