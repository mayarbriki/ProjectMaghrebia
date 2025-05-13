import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-life-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Life Insurance Details</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Full Name -->
        <div class="form-group md:col-span-2">
          <label for="fullName" class="block mb-2 font-medium">Full Name *</label>
          <input
            type="text"
            id="fullName"
            formControlName="fullName"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('fullName')?.invalid && parentForm.get('fullName')?.touched"
            class="text-red-500 mt-1">
            Full name is required
          </div>
        </div>

        <!-- Date of Birth -->
        <div class="form-group">
          <label for="dateOfBirth" class="block mb-2 font-medium">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            formControlName="dateOfBirth"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('dateOfBirth')?.invalid && parentForm.get('dateOfBirth')?.touched"
            class="text-red-500 mt-1">
            Date of birth is required
          </div>
        </div>

        <!-- Occupation -->
        <div class="form-group">
          <label for="occupation" class="block mb-2 font-medium">Occupation *</label>
          <input
            type="text"
            id="occupation"
            formControlName="occupation"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('occupation')?.invalid && parentForm.get('occupation')?.touched"
            class="text-red-500 mt-1">
            Occupation is required
          </div>
        </div>

        <!-- Smoker -->
        <div class="form-group">
          <div class="flex items-center mt-6">
            <input
              type="checkbox"
              id="smoker"
              formControlName="smoker"
              class="mr-2 h-5 w-5"
            />
            <label for="smoker" class="font-medium">Smoker</label>
          </div>
        </div>
      </div>
    </div>
  `,
       viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective }
      ]
})
export class LifePropertyFormComponentF {
  constructor(private controlContainer: ControlContainer) {}

  // A getter to access the parent's FormGroup
  get parentForm(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
