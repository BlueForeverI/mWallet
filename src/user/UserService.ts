import { Service } from 'vue-typedi';
import { LoginViewModel } from '../view-models/LoginViewModel';
import { TokenViewModel } from '../view-models/TokenViewModel';
import Config from '@/config/config';
import axios, { AxiosPromise } from 'axios';
import { RegisterViewModel } from '@/view-models/RegisterViewModel';

@Service()
export class UserService {

  private baseUrl: string = Config.API_URL + '/users';

  public login(loginVm: LoginViewModel): AxiosPromise<TokenViewModel> {
    return axios.post<TokenViewModel>(this.baseUrl + '/login', loginVm);
  }

  public register(registerVm: RegisterViewModel): AxiosPromise<TokenViewModel> {
    return axios.post<TokenViewModel>(this.baseUrl + '/register', registerVm);
  }
}
