import { Service } from 'vue-typedi';
import Config from '@/config/config';
import store from '@/store';
import axios, { AxiosPromise } from 'axios';
import { Category } from '@/models/Category';

@Service()
export class CategoryService {

  private baseUrl: string = Config.API_URL + '/categories';

  public getAll(): AxiosPromise<Category[]> {
    return axios.get(this.baseUrl, {
      headers: {
        Authorization: store.state.token,
      },
    });
  }
}
