import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private defaultTimeout = 30000;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        timeout(this.defaultTimeout),
        retry(1),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        })
      );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        })
      );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        })
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        })
      );
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return httpParams;
  }
}