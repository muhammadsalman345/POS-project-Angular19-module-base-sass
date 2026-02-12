import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, '✓', {
      ...this.config,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.config,
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'ℹ', {
      ...this.config,
      panelClass: ['snackbar-info']
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, '⚠', {
      ...this.config,
      panelClass: ['snackbar-warning']
    });
  }
}