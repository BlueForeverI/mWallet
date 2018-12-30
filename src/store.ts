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
}

export default new Vuex.Store<AppState>({
  state: {
    token: '',
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {

  },
  plugins: [vuexPersist.plugin],
});
