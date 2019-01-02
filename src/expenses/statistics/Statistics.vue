<template>
  <v-container fluid row justify-space-between>
    <v-flex md4 px-1>
      <v-card class="elevation-5">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Total</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid fill-height>
            <v-layout align-center justify-center>
              {{ total.toFixed(2) }}
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex md4 px-1>
      <v-card class="elevation-5">
        <v-toolbar dark color="primary">
          <v-toolbar-title>By Category</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <canvas id='byCategoryChart' width='400px' height='400px'></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex md4 px-1>
      <v-card class="elevation-5">
        <v-toolbar dark color="primary">
          <v-toolbar-title>By Day</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <canvas id='byDayChart' width='400px' height='400px'></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Inject } from 'vue-typedi';

import { ExpenseService } from '@/expenses/ExpenseService';
import { CategoryService } from '@/expenses/CategoryService';
import { Component } from 'vue-property-decorator';
import Chart from 'chart.js';
import { Category } from '@/models/Category';
import { Expense } from '@/models/Expense';

@Component
export default class StatisticsComponent extends Vue {

  @Inject()
  private categoryService!: CategoryService;

  @Inject()
  private expenseService!: ExpenseService;

  private expenses: Expense[] = [];
  private categoryMap: { [key: string]: string } = {};

  private byCategoryChart: any = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        label: 'Total',
        backgroundColor: this.getShuffledColors(),
        data: [],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  private byDayChart: any = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        backgroundColor: this.getShuffledColors(),
        data: [],
      }],
    },
    options: {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  public mounted() {
    this.$store.state.isLoading = true;
    Promise.all([this.expenseService.getAll(), this.categoryService.getAll()])
      .then((resp) => {
        this.categoryMap = resp[1].data.reduce((map: any, obj) => {
          map[obj.id] = obj.name;
          return map;
        }, {});

        this.expenses = resp[0].data;
        this.$store.state.isLoading = false;

        this.initByCategoryChart();
        this.initByDayChart();
      });
  }

  public get total(): number {
    return this.expenses.reduce((prev: number, curr: Expense) => prev + curr.amount, 0);
  }

  private initByCategoryChart(): void {
    const expenseMap: { [key: string]: number } = {};
    this.expenses.forEach((exp) => {
      const categoryName = this.categoryMap[exp.categoryId];
      if (!expenseMap[categoryName]) {
        expenseMap[categoryName] = exp.amount;
      } else {
        expenseMap[categoryName] += exp.amount;
      }
    });

    Object.entries(expenseMap)
      .forEach((val) => {
        this.byCategoryChart.data.labels.push(val[0]);
        this.byCategoryChart.data.datasets[0].data.push(val[1]);
      });

    const byCategory = new Chart('byCategoryChart', this.byCategoryChart);
  }

  private initByDayChart(): void {
    const expenseMap: { [key: string]: number } = {};
    this.expenses.forEach((exp) => {
      const date = this.$options.filters!.formatDate(exp.date);

      if (!expenseMap[date]) {
        expenseMap[date] = exp.amount;
      } else {
        expenseMap[date] += exp.amount;
      }
    });

    Object.entries(expenseMap)
      .forEach((val) => {
        this.byDayChart.data.labels.push(val[0]);
        this.byDayChart.data.datasets[0].data.push(val[1]);
      });

    const byCategory = new Chart('byDayChart', this.byDayChart);
  }

  private getShuffledColors(): string[]  {
    const originalColors: string[] = ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'];

    return originalColors.sort(() => Math.random() - 0.5);
  }
}
</script>

<style lang="scss" scoped>
.v-card__text:first-of-type {
  height: 432px;
  font-size: 5rem;
}
</style>


