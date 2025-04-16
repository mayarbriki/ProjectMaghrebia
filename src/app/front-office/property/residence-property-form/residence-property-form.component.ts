import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-residence-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Residence Details</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Address Line 1 -->
        <div class="form-group md:col-span-2">
          <label for="addressLine1" class="block mb-2 font-medium">Address Line 1 *</label>
          <input
            type="text"
            id="addressLine1"
            formControlName="addressLine1"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('addressLine1')?.invalid && parentForm.get('addressLine1')?.touched"
            class="text-red-500 mt-1">
            Address Line 1 is required
          </div>
        </div>

        <!-- Address Line 2 -->
        <div class="form-group md:col-span-2">
          <label for="addressLine2" class="block mb-2 font-medium">Address Line 2</label>
          <input
            type="text"
            id="addressLine2"
            formControlName="addressLine2"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- City -->
        <div class="form-group">
          <label for="city" class="block mb-2 font-medium">City *</label>
          <input
            type="text"
            id="city"
            formControlName="city"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('city')?.invalid && parentForm.get('city')?.touched"
            class="text-red-500 mt-1">
            City is required
          </div>
        </div>

        <!-- State -->
        <div class="form-group">
          <label for="state" class="block mb-2 font-medium">State *</label>
          <input
            type="text"
            id="state"
            formControlName="state"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('state')?.invalid && parentForm.get('state')?.touched"
            class="text-red-500 mt-1">
            State is required
          </div>
        </div>

        <!-- Postal Code -->
        <div class="form-group">
          <label for="postalCode" class="block mb-2 font-medium">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            formControlName="postalCode"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('postalCode')?.invalid && parentForm.get('postalCode')?.touched"
            class="text-red-500 mt-1">
            Postal code is required
          </div>
        </div>

        <!-- Country -->
        <div class="form-group">
          <label for="country" class="block mb-2 font-medium">Country *</label>
          <input
            type="text"
            id="country"
            formControlName="country"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('country')?.invalid && parentForm.get('country')?.touched"
            class="text-red-500 mt-1">
            Country is required
          </div>
        </div>

        <!-- Square Footage -->
        <div class="form-group">
          <label for="squareFootage" class="block mb-2 font-medium">Square Footage *</label>
          <input
            type="number"
            id="squareFootage"
            formControlName="squareFootage"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('squareFootage')?.invalid && parentForm.get('squareFootage')?.touched"
            class="text-red-500 mt-1">
            Square footage is required
          </div>
        </div>

        <!-- Year Built -->
        <div class="form-group">
          <label for="yearBuilt" class="block mb-2 font-medium">Year Built *</label>
          <input
            type="number"
            id="yearBuilt"
            formControlName="yearBuilt"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('yearBuilt')?.invalid && parentForm.get('yearBuilt')?.touched"
            class="text-red-500 mt-1">
            Year built is required
          </div>
        </div>

        <!-- Construction Type -->
        <div class="form-group">
          <label for="constructionType" class="block mb-2 font-medium">Construction Type</label>
          <input
            type="text"
            id="constructionType"
            formControlName="constructionType"
            class="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  `,
         viewProviders: [
          { provide: ControlContainer, useExisting: FormGroupDirective }
        ]
})
export class ResidencePropertyFormComponentF {
  constructor(private controlContainer: ControlContainer) {}

  // A getter to access the parent's FormGroup
  get parentForm(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
