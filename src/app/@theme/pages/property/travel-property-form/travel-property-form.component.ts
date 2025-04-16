import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-travel-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Travel Insurance Details</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Destination -->
        <div class="form-group md:col-span-2">
          <label for="destination" class="block mb-2 font-medium">Destination *</label>
          <input
            type="text"
            id="destination"
            formControlName="destination"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('destination')?.invalid && parentForm.get('destination')?.touched"
            class="text-red-500 mt-1">
            Destination is required
          </div>
        </div>

        <!-- Departure Date -->
        <div class="form-group">
          <label for="departureDate" class="block mb-2 font-medium">Departure Date *</label>
          <input
            type="date"
            id="departureDate"
            formControlName="departureDate"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('departureDate')?.invalid && parentForm.get('departureDate')?.touched"
            class="text-red-500 mt-1">
            Departure date is required
          </div>
        </div>

        <!-- Return Date -->
        <div class="form-group">
          <label for="returnDate" class="block mb-2 font-medium">Return Date *</label>
          <input
            type="date"
            id="returnDate"
            formControlName="returnDate"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('returnDate')?.invalid && parentForm.get('returnDate')?.touched"
            class="text-red-500 mt-1">
            Return date is required
          </div>
        </div>

        <!-- Travel Purpose -->
        <div class="form-group md:col-span-2">
          <label for="travelPurpose" class="block mb-2 font-medium">Travel Purpose *</label>
          <select
            id="travelPurpose"
            formControlName="travelPurpose"
            class="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select purpose</option>
            <option value="Business">Business</option>
            <option value="Leisure">Leisure</option>
            <option value="Medical">Medical</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
          <div
            *ngIf="parentForm.get('travelPurpose')?.invalid && parentForm.get('travelPurpose')?.touched"
            class="text-red-500 mt-1">
            Travel purpose is required
          </div>
        </div>
      </div>
    </div>
  `,
           viewProviders: [
            { provide: ControlContainer, useExisting: FormGroupDirective }
          ]
})
export class TravelPropertyFormComponent {
  constructor(private controlContainer: ControlContainer) {}

  // A getter to access the parent's FormGroup
  get parentForm(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
