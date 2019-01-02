<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field prepend-icon="person" name="email" label="Email" type="text"
                  v-model="vm.email" @keyup.enter="login"></v-text-field>
                <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password"
                  v-model="vm.password" @keyup.enter="login"></v-text-field>
              </v-form>
              <p class="error-container" v-if="error">{{ error }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <router-link to="/register" class="mr-3">Register</router-link>
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject } from 'vue-typedi';

import { UserService } from './UserService';
import { LoginViewModel } from '@/view-models/LoginViewModel';

@Component
export default class LoginComponent  extends Vue {
  @Inject()
  public userService!: UserService;

  private vm: LoginViewModel = new LoginViewModel('', '');
  private error: string = '';

  private login(): void {
    this.userService.login(this.vm)
      .then((resp) => {
        this.$store.commit('setToken', resp.data.token);
        this.$store.commit('setUser', this.vm.email);
        this.$router.push('/expenses/new');
      })
      .catch((err) => {
        this.error = err.response.data.message;
      });
  }
}
</script>

<style lang="scss" scoped>
.error-container {
  color: red;
}
</style>

