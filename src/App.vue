<template>
  <div id="app">
    <v-app>
      <v-container fluid>
      <!-- <vue-loading type="spin" :size="{ width: '100%', height: '100%' }"></vue-loading> -->
        <v-layout column>
          <v-flex tag="header" v-if="isUserLogged" md-12>
            <v-toolbar dark color="primary">
              <v-toolbar-title>mWallet</v-toolbar-title>
              <v-spacer></v-spacer>
              <span>{{ user }}</span>
              <v-icon class="btn ml-3" @click="logout">power_settings_new</v-icon>
            </v-toolbar>
          </v-flex>

          <v-flex tag="nav" v-if="isUserLogged" md-12 row justify-center mt-4>
            <router-link to="/expenses/new" class="mx-5 pb-2">New Expense</router-link>
            <router-link to="/expenses" class="mx-5 pb-2">All Expenses</router-link>
            <router-link to="/expenses/statistics" class="mx-5 pb-2">Statistics</router-link>
          </v-flex>

          <v-flex md-12>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { VueLoading } from 'vue-loading-template';

@Component
export default class AppComponent extends Vue {
  get isUserLogged(): boolean {
    return !!this.$store.state.token;
  }

  get user(): string {
    return this.$store.state.user;
  }

  private logout(): void {
    this.$store.commit('clearToken');
    this.$router.push('/login');
  }
}
</script>

<style lang="scss" scoped>

nav {
  a {
    font-size: 2rem;
    color: black;

    &:hover {
      text-decoration: none;
    }

    &.router-link-exact-active {
      border-bottom: 3px solid #1976d2;
    }
  }
}
</style>

