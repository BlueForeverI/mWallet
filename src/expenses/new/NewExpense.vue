<template>
  <div id="new-expense">
    <h1>New Expense</h1>

    <form @submit.prevent="create">
      <input type="number" v-model.number="expense.amount" 
        name="amount" placeholder="Amount" />

      <select v-model="expense.categoryId">
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <br />
      <input type="submit" value="Create" />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject } from 'vue-typedi';
import { CategoryService } from '@/expenses/CategoryService';
import { Category } from '@/models/Category';
import { Expense } from '@/models/Expense';
import { ExpenseService } from '@/expenses/ExpenseService';

@Component
export default class NewExpenseComponent extends Vue {
  @Inject()
  private categoryService!: CategoryService;

  @Inject()
  private expenseService!: ExpenseService;

  private expense: Expense = new Expense('', 0, '', '', new Date());
  private categories: Category[] = [];

  constructor() {
    super();

    this.categoryService.getAll()
      .then((response) => this.categories.push(...response.data));
  }

  private create(): void {
    this.expense.userId = this.$store.state.token;

    this.expenseService.create(this.expense)
      .then((response) => this.$router.push('/expenses'));
  }
}
</script>
