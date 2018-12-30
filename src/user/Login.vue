<template>
  <div id="login">
    <h1>Login</h1>
    <router-link to="/register">Register</router-link>

    <form @submit.prevent="login">
      <input type="email" v-model="vm.email" name="email" placeholder="Email" />
      <br />
      <input type="password" v-model="vm.password" name="password" placeholder="Password" />
      <br />
      <input type="submit" value="Login" />
      <p class="error-container" v-if="error">{{ error }}</p>
    </form>
  </div>
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

