<template>
  
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field name="email" label="Email" type="text"
                  v-model="vm.email" @keyup.enter="register"></v-text-field>
                <v-text-field name="password" label="Password" id="password" type="password"
                  v-model="vm.password" @keyup.enter="register"></v-text-field>
                <v-text-field name="firstName" label="First Name" type="text"
                  v-model="vm.firstName" @keyup.enter="register"></v-text-field>
                <v-text-field name="lastName" label="Last Name" type="text"
                  v-model="vm.lastName" @keyup.enter="register"></v-text-field>
                <v-text-field name="age" label="Age" type="number"
                  v-model.number="vm.age" @keyup.enter="register"></v-text-field>
              </v-form>
              <p class="error-container" v-if="error">{{ error }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <router-link to="/login" class="mr-3">Login</router-link>
              <v-btn color="primary" @click="register">Register</v-btn>
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
import { UserService } from '@/user/UserService';
import { RegisterViewModel } from '@/view-models/RegisterViewModel';

@Component
export default class RegisterComponent  extends Vue {
  @Inject()
  private userService!: UserService;

  private vm: RegisterViewModel = new RegisterViewModel('', '', '', 0, '');
  private error: string = '';

  private register(): void {
    this.$store.state.isLoading = true;
    this.userService.register(this.vm)
      .then((resp) => {
        this.$store.state.isLoading = false;
        this.$store.commit('setToken', resp.data.token);
        this.$store.commit('setUser', this.vm.email);
        this.$router.push('/expenses/new');
      })
      .catch((err) => {
        this.$store.state.isLoading = false;
        this.error = err.response.data.message;
      });
  }
}
</script>

<style lang="scss" scoped>

</style>


