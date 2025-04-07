import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  BASE_URL = 'https://trombinoscope.hello-mcdo.ovh';
  // BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.BASE_URL + url, { withCredentials: true });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.BASE_URL + url, body, {
      withCredentials: true,
    });
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(this.BASE_URL + url, body, {
      withCredentials: true,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.BASE_URL + url, { withCredentials: true });
  }
}
