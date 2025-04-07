import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/internal/Observable';
import { LoginForm } from '../pages/login/loginForm';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = '/auth';

  constructor(private apiService: ApiService) {}

  login(body: LoginForm) {
    return this.apiService.post(`${this.BASE_URL}/login`, body);
  }

  logout() {
    return this.apiService.post(`${this.BASE_URL}/logout`, {});
  }

  check(): Observable<any> {
    return this.apiService.get(`${this.BASE_URL}/check`);
  }
}
