<template>
  <v-container fluid>
    <v-flex md4 offset-md-4 align-center justify-center pt-5>
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

        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          lazy
          full-width
          width="290px">
          <v-text-field
            slot="activator"
            v-model="formattedDate"
            label="Date"
            prepend-icon="event"
            readonly>
          </v-text-field>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>

        <v-btn color="success" @click="create" class="ml-0">Create</v-btn>
      </form>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject } from 'vue-typedi';
import moment from 'moment';

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
  private modal: boolean = false;
  private pickerDefaultFormat: string = 'YYYY-MM-DD';
  private date: string = moment(new Date()).format(this.pickerDefaultFormat);

  public mounted() {
    this.categoryService.getAll()
      .then((response) => {
        this.expenseCategory = response.data[0];
        this.categories.push(...response.data);
      });
  }

  private get formattedDate(): string {
    return this.$options.filters!.formatDate(this.date);
  }

  private create(): void {
    this.expense.categoryId = this.expenseCategory.id;
    this.expense.userId = this.$store.state.token;
    this.expense.date = moment(this.date, this.pickerDefaultFormat).toDate();

    this.$store.state.isLoading = true;
    this.expenseService.create(this.expense)
      .then((response) => this.$router.push('/expenses'));
  }
}
</script>
