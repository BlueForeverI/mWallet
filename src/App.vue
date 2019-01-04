<template>
  <div id="app">
    <v-app>
      <v-container fluid :class="{ 'pt-0': isMobile }">
        <vue-loading type="spin" :size="{ width: '100%', height: '100%' }" v-if="isLoading"></vue-loading>
        <v-navigation-drawer permanent absolute v-if="showSideMenu">
          <v-toolbar dark color="primary">
            {{ user }}
            <v-spacer></v-spacer>
            <v-icon class="btm" v-if="isMobile" @click="showSideMenu = false">close</v-icon>
          </v-toolbar>

          <v-list dense class="pt-3">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>create</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <router-link to="/expenses/new">New Expense</router-link>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <router-link to="/expenses">All Expenses</router-link>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>pie_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <router-link to="/expenses/statistics">Statistics</router-link>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-layout column>
          <v-flex tag="header" v-if="isUserLogged" md-12>
            <v-toolbar dark color="primary">
              <v-icon class="btm" v-if="isMobile" @click="showSideMenu = true">menu</v-icon>
              <v-spacer v-if="isMobile"></v-spacer>
              <v-toolbar-title>mWallet</v-toolbar-title>
              <v-spacer></v-spacer>
              <span v-if="!isMobile">{{ user }}</span>
              <v-icon class="btn ml-3" @click="logout">power_settings_new</v-icon>
            </v-toolbar>
          </v-flex>

          <v-flex tag="nav" v-if="isUserLogged && !isMobile" md-12 row justify-center mt-4>
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
import { Watch } from 'vue-property-decorator';

@Component
export default class AppComponent extends Vue {

  private showSideMenu: boolean = false;

  get isUserLogged(): boolean {
    return !!this.$store.state.token;
  }

  get isLoading(): boolean {
    return this.$store.state.isLoading;
  }

  get user(): string {
    return this.$store.state.user;
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
  }

  @Watch('$route')
  private onRouteChange(to: any, from: any): void {
    this.showSideMenu = false;
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

