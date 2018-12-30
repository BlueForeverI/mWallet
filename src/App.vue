<template>
  <div id="app">
    <!-- <vue-loading type="spin" :size="{ width: '100%', height: '100%' }"></vue-loading> -->
    <header v-if="isUserLogged">
      <h2>Hello, {{ user }}</h2>
      <button @click="logout">Logout</button>

      <nav>
        <router-link to="/expenses/new">New Expense</router-link> |
        <router-link to="/expenses">All Expenses</router-link>
      </nav>
    </header>

    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { VueLoading } from 'vue-loading-template';

@Component({ components: {VueLoading} })
export default class AppComponent extends Vue {
  get isUserLogged(): boolean {
    return !!this.$store.state.token;
  }

  get user(): string {
    return this.$store.state.user;
  }

  private logout(): void {
    this.$store.commit('clearToken');
    this.$router.push('login');
  }
}
</script>

