<template>
  <div id="list-expenses">
    <h1>List Expenses</h1>

    <ul>
      <li v-for="expense in expenses" :key="expense.id">
        {{ expense.amount }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Inject } from 'vue-typedi';
import { ExpenseService } from '@/expenses/ExpenseService';
import { Expense } from '@/models/Expense'; 
import Component from 'vue-class-component';

@Component
export default class ListExpensesComponent extends Vue {
  @Inject()
  private expenseService!: ExpenseService;

  private expenses: Expense[] = [];

  constructor() {
    super();

    this.expenseService.getAll()
      .then((response) => this.expenses.push(...response.data));
  }
}
</script>

