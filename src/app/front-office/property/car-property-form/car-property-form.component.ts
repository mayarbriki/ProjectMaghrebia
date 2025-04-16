import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Vehicle Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Make -->
        <div class="form-group">
          <label for="make" class="block mb-2 font-medium">Make *</label>
          <input
            type="text"
            id="make"
            formControlName="make"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('make')?.invalid && parentForm.get('make')?.touched"
            class="text-red-500 mt-1">
            Make is required
          </div>
        </div>
        <!-- Model -->
        <div class="form-group">
          <label for="model" class="block mb-2 font-medium">Model *</label>
          <input
            type="text"
            id="model"
            formControlName="model"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('model')?.invalid && parentForm.get('model')?.touched"
            class="text-red-500 mt-1">
            Model is required
          </div>
        </div>
        <!-- Year -->
        <div class="form-group">
          <label for="year" class="block mb-2 font-medium">Year *</label>
          <input
            type="number"
            id="year"
            formControlName="year"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('year')?.invalid && parentForm.get('year')?.touched"
            class="text-red-500 mt-1">
            Year is required
          </div>
        </div>
        <!-- License Plate -->
        <div class="form-group">
          <label for="licensePlate" class="block mb-2 font-medium">License Plate *</label>
          <input
            type="text"
            id="licensePlate"
            formControlName="licensePlate"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('licensePlate')?.invalid && parentForm.get('licensePlate')?.touched"
            class="text-red-500 mt-1">
            License plate is required
          </div>
        </div>
        <!-- VIN -->
        <div class="form-group">
          <label for="vin" class="block mb-2 font-medium">VIN</label>
          <input
            type="text"
            id="vin"
            formControlName="vin"
            class="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  `,
  // This makes the parent FormGroup available within the child component.
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CarPropertyFormComponentF {
  constructor(private controlContainer: ControlContainer) {}

  // A getter to access the parent's FormGroup
  get parentForm(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
