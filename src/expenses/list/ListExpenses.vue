<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="expenses"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.date | formatDate}}</td>
        <td>{{ props.item.amount }}</td>
        <td>{{ categoryMap.get(props.item.categoryId).name }}</td>
        <td>
          <v-icon class="btn p-0" @click="deleteExpense(props.item.id)" color="error">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Inject } from 'vue-typedi';

import { ExpenseService } from '@/expenses/ExpenseService';
import { CategoryService } from '@/expenses/CategoryService';
import { Expense } from '@/models/Expense';
import Component from 'vue-class-component';
import { Category } from '@/models/Category';

@Component
export default class ListExpensesComponent extends Vue {
  @Inject()
  private categoryService!: CategoryService;

  @Inject()
  private expenseService!: ExpenseService;

  private categoryMap: Map<string, Category> = new Map();
  private expenses: Expense[] = [];
  private headers: any[] = [
    { text: 'Date', value: 'date' },
    { text: 'Amount', value: 'amount' },
    { text: 'Category', value: 'categoryId' },
    { text: ' ' },
  ];

  constructor() {
    super();

    this.$store.state.isLoading = true;
    Promise.all([this.expenseService.getAll(), this.categoryService.getAll()])
      .then((resp) => {
        resp[1].data.forEach((cat) => this.categoryMap.set(cat.id, cat));
        this.expenses.push(...resp[0].data);
        this.$store.state.isLoading = false;
      });
  }

  private reloadExpenses(): void {
    this.expenseService.getAll()
      .then((resp) => {
        this.expenses.splice(0, this.expenses.length);
        this.expenses.push(...resp.data);
      });
  }

  private deleteExpense(id: string): void {
    this.expenseService.delete(id)
      .then(() => this.reloadExpenses());
  }
}
</script>

