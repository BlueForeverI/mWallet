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
}

export default new Vuex.Store<AppState>({
  state: {
    token: '',
    user: '',
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = '';
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {

  },
  plugins: [vuexPersist.plugin],
});
