<template>
  <v-container fluid>
    <v-flex md4 offset-md-4 align-center justify-center pt-5>
      <form>
        <v-text-field
          type="number"
          v-model.number="income" 
          name="income"
          label="Monthly Income"></v-text-field>
        <v-btn color="success" @click="update" class="ml-0">Update</v-btn>
      </form>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Container, Inject } from 'vue-typedi';
import Component from 'vue-class-component';
import { UserService } from '@/user/UserService';

@Component
export default class SettingsComponent extends Vue {

  @Inject()
  private userService!: UserService;

  private income: number = 0;

  public mounted() {
    this.income = this.$store.state.income;
  }

  private update(): void {
    this.$store.state.isLoading = true;
    this.userService.updateIncome(this.income)
      .then(() => {
        this.$store.commit('setIncome', this.income);
        this.$store.state.isLoading = false;
        this.$router.push('/');
      });
  }
}
</script>

