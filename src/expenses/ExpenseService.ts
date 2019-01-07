import { Service } from 'vue-typedi';
import Config from '@/config/config';
import axios, { AxiosPromise } from 'axios';
import store from '@/store';
import { Expense } from '@/models/Expense';
import { Moment } from 'moment';

@Service()
export class ExpenseService {
  private baseUrl: string = Config.API_URL + '/expenses';

  public getAll(start?: Moment, end?: Moment): AxiosPromise<Expense[]> {
    let url = this.baseUrl;

    if (start != null && end != null) {
      url += `?start=${start.format(store.state.dateFormat)}&end=${end.format(store.state.dateFormat)}`;
    }

    return axios.get<Expense[]>(url, {
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

  public delete(id: string): AxiosPromise {
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: store.state.token,
      },
    });
  }
}
