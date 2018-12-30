<template>
  <div id="register">
    <h1>Register</h1>
    <router-link to="/login">Login</router-link>

    <form @submit.prevent="register">
      <input type="email" v-model="vm.email" name="email" placeholder="Email" />
      <br />
      <input type="password" v-model="vm.password" name="password" placeholder="Password" />
      <br />
      <input type="text" v-model="vm.firstName" name="firstName" placeholder="First Name" />
      <br />
      <input type="text" v-model="vm.lastName" name="lastName" placeholder="Last Name" />
      <br />
      <input type="number" v-model.number="vm.age" name="age" placeholder="Age" />
      <br />

      <input type="submit" value="Register" />
      <p class="error-container" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject } from 'vue-typedi';
import { UserService } from '@/user/UserService';
import { RegisterViewModel } from '@/view-models/RegisterViewModel';

@Component
export default class RegisterComponent  extends Vue {
  @Inject()
  private userService!: UserService;

  private vm: RegisterViewModel = new RegisterViewModel('', '', '', 0, '');
  private error: string = '';

  private register(): void {
    this.userService.register(this.vm)
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

</style>


