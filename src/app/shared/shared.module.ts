import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Imports (Aap inhein alag MaterialModule mein bhi rakh sakte hain)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    // Yahan apne custom reusable components register karein
    // Example: CustomLoaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
  ],
  exports: [
    // Export karna zaroori hai taake doosre modules inhe use kar saken
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    // CustomLoaderComponent (agar banaya hai to)
  ]
})
export class SharedModule { }