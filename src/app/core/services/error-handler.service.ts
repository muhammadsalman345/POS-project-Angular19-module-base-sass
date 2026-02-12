import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private toastService: ToastService,
    private router: Router
  ) {}

  handleError(error: any): void {
    let message = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          message = error.error?.message || 'Bad request';
          break;
        case 401:
          message = 'Session expired. Please login again';
          this.router.navigate(['/auth/login']);
          break;
        case 403:
          message = 'You don\'t have permission to access this resource';
          break;
        case 404:
          message = 'Resource not found';
          break;
        case 500:
          message = 'Internal server error';
          break;
        default:
          message = error.error?.message || error.message || 'Server error';
      }
    } else if (error.message) {
      message = error.message;
    }

    this.toastService.error(message);
    console.error('Error:', error);
  }

  handleSuccess(message: string): void {
    debugger;
    this.toastService.success(message);
  }
}