<template>
  <v-container fluid>
    <v-flex md4 offset-md-4>
      <form>
        <v-text-field
          type="number"
          v-model.number="expense.amount" 
          name="amount"
          label="Amount"></v-text-field>
        <v-combobox
          v-model="expenseCategory"
          :items="categories"
          label="Category"
          item-text="name">
        </v-combobox>
        <v-btn color="success" @click="create" class="ml-0">Create</v-btn>
      </form>
    </v-flex>
  </v-container>
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

  private expenseCategory: Category = new Category('', '');
  private expense: Expense = new Expense('', 0, '', '', new Date());
  private categories: Category[] = [];

  constructor() {
    super();

    this.categoryService.getAll()
      .then((response) => this.categories.push(...response.data));
  }

  private create(): void {
    this.expense.categoryId = this.expenseCategory.id;
    this.expense.userId = this.$store.state.token;

    this.expenseService.create(this.expense)
      .then((response) => this.$router.push('/expenses'));
  }
}
</script>
