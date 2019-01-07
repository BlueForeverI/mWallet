<template>
  <v-container fluid row justify-space-between px-0>
    <v-flex md12>
      <v-icon class="position-absolute mt-3 ml-3">calendar_today</v-icon>
      <input type="text" name="daterange" id="daterange" class="border ml-1 p-3 pl-5 font-weight-bold" />
    </v-flex>
    <v-flex md4 px-1 py-2>
      <v-card class="elevation-5">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Total</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid fill-height>
            <v-layout align-center justify-center column>
              <p>Spent <span class="text-danger">{{ total.toFixed(2) }}</span></p>
              <p v-if="monthlyView">Saved <span class="text-success">{{ saved.toFixed(2) }}</span></p>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex md4 px-1 py-2>
      <v-card class="elevation-5">
        <v-toolbar dark color="primary">
          <v-toolbar-title>By Category</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <canvas id='byCategoryChart' width='400px' height='400px'></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex md4 px-1 py-2>
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
import daterangepicker, { Options } from 'daterangepicker';
import moment, { Moment } from 'moment';

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
  private startDate: Moment = moment().startOf('month');
  private endDate: Moment = moment().endOf('month');

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
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        data: [],
        fill: false,
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

  private pickerOptions: Options = {
    opens: 'left',
    ranges: {
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'This Year': [moment().startOf('year'), moment().endOf('year')],
    },
    locale: {
      format: this.$store.state.dateFormat,
    },
    startDate: this.startDate,
    endDate: this.endDate,
  };

  public mounted() {
    this.$store.state.isLoading = true;
    Promise.all([
        this.expenseService.getAll(
          this.pickerOptions.startDate as Moment,
          this.pickerOptions.endDate as Moment),
        this.categoryService.getAll()])
      .then((resp) => {
        this.categoryMap = resp[1].data.reduce((map: any, obj) => {
          map[obj.id] = obj.name;
          return map;
        }, {});

        this.$store.state.isLoading = false;
        this.reloadData(resp[0].data);
      });

    const picker = new daterangepicker(
      document.getElementById('daterange')!,
      this.pickerOptions,
      (start: Moment, end: Moment) => {
        this.startDate = start;
        this.endDate = end;
        this.expenseService.getAll(start, end)
          .then((resp) => this.reloadData(resp.data));
      });
  }

  private reloadData(expenses: Expense[]): void {
    this.expenses = expenses;

    this.initByCategoryChart();
    this.initByDayChart();
  }

  public get total(): number {
    return this.expenses.reduce((prev: number, curr: Expense) => prev + curr.amount, 0);
  }

  public get saved(): number {
    return this.$store.state.income - this.total;
  }

  public get monthlyView(): boolean {
    const diff = this.endDate.diff(this.startDate, 'days');
    return diff > 28 && diff < 32;
  }

  private initByCategoryChart(): void {
    const expenseMap: { [key: string]: number } = {};
    this.expenses.forEach((exp) => {
      const categoryName = this.categoryMap[exp.categoryId];

      if (categoryName) {
        if (!expenseMap[categoryName]) {
          expenseMap[categoryName] = exp.amount;
        } else {
          expenseMap[categoryName] += exp.amount;
        }
      }
    });

    this.byCategoryChart.data.labels = [];
    this.byCategoryChart.data.datasets[0].data = [];

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

    this.byDayChart.data.labels = [];
    this.byDayChart.data.datasets[0].data = [];

    Object.entries(expenseMap)
      .forEach((val) => {
        this.byDayChart.data.labels.push(val[0]);
        this.byDayChart.data.datasets[0].data.push(val[1]);
      });

    const color = this.getShuffledColors()[0];
    this.byDayChart.data.datasets[0].backgroundColor = color;
    this.byDayChart.data.datasets[0].borderColor = color;
    const byCategory = new Chart('byDayChart', this.byDayChart);
  }

  private getShuffledColors(): string[]  {
    const originalColors: string[] = ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'];

    return originalColors.sort(() => Math.random() - 0.5);
  }
}
</script>

<style lang="scss" scoped>
#daterange {
  font-size: 1.2rem;
}

.v-card__text:first-of-type {
  height: 432px;
  font-size: 4rem;
}
</style>


