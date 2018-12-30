import { Service } from 'vue-typedi';
import Config from '@/config/config';
import axios, { AxiosPromise } from 'axios';
import { Category } from '@/models/Category';
import store from '@/store';
import { Expense } from '@/models/Expense';

@Service()
export class ExpenseService {
  private baseUrl: string = Config.API_URL + '/expenses';

  public getAll(): AxiosPromise<Expense[]> {
    return axios.get<Expense[]>(this.baseUrl, {
      headers: {
        Authorization: store.state.token,
      },
    });
  }

  public create(expense: Expense): AxiosPromise<Expense> {
    return axios.post<Expense>(this.baseUrl, expense, {
      headers: {
        Authorization: store.state.token,
      },
    });
  }
}
