import { Service } from 'vue-typedi';
import { LoginViewModel } from '../view-models/LoginViewModel';
import { LoggedUserViewModel } from '../view-models/LoggedUserViewModel';
import Config from '@/config/config';
import axios, { AxiosPromise } from 'axios';
import { RegisterViewModel } from '@/view-models/RegisterViewModel';
import store from '@/store';

@Service()
export class UserService {

  private baseUrl: string = Config.API_URL + '/users';

  public login(loginVm: LoginViewModel): AxiosPromise<LoggedUserViewModel> {
    return axios.post<LoggedUserViewModel>(this.baseUrl + '/login', loginVm);
  }

  public register(registerVm: RegisterViewModel): AxiosPromise<LoggedUserViewModel> {
    return axios.post<LoggedUserViewModel>(this.baseUrl + '/register', registerVm);
  }

  public updateIncome(income: number): AxiosPromise {
    return axios.put(this.baseUrl + '/updateIncome', { income }, {
      headers: {
        Authorization: store.state.token,
      },
    });
  }
}
