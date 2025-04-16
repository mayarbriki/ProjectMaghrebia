import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-commercial-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Commercial Insurance Details</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Business Name -->
        <div class="form-group md:col-span-2">
          <label for="businessName" class="block mb-2 font-medium">Business Name *</label>
          <input
            type="text"
            id="businessName"
            formControlName="businessName"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('businessName')?.invalid && parentForm.get('businessName')?.touched"
            class="text-red-500 mt-1">
            Business name is required
          </div>
        </div>

        <!-- Business Type -->
        <div class="form-group">
          <label for="businessType" class="block mb-2 font-medium">Business Type *</label>
          <select
            id="businessType"
            formControlName="businessType"
            class="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select business type</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Service">Service</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
          <div
            *ngIf="parentForm.get('businessType')?.invalid && parentForm.get('businessType')?.touched"
            class="text-red-500 mt-1">
            Business type is required
          </div>
        </div>

        <!-- Number of Employees -->
        <div class="form-group">
          <label for="numberOfEmployees" class="block mb-2 font-medium">Number of Employees *</label>
          <input
            type="number"
            id="numberOfEmployees"
            formControlName="numberOfEmployees"
            class="w-full p-2 border rounded-md"
          />
          <div
            *ngIf="parentForm.get('numberOfEmployees')?.invalid && parentForm.get('numberOfEmployees')?.touched"
            class="text-red-500 mt-1">
            Number of employees is required
          </div>
        </div>

        <!-- Annual Revenue -->
        <div class="form-group">
          <label for="annualRevenue" class="block mb-2 font-medium">Annual Revenue</label>
          <input
            type="number"
            id="annualRevenue"
            formControlName="annualRevenue"
            class="w-full p-2 border rounded-md"
          />
        </div>

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
          <label for="state" class="block mb-2 font-medium">State</label>
          <input
            type="text"
            id="state"
            formControlName="state"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- Postal Code -->
        <div class="form-group">
          <label for="postalCode" class="block mb-2 font-medium">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            formControlName="postalCode"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- Country -->
        <div class="form-group">
          <label for="country" class="block mb-2 font-medium">Country</label>
          <input
            type="text"
            id="country"
            formControlName="country"
            class="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  `
    ,
     viewProviders: [
      { provide: ControlContainer, useExisting: FormGroupDirective }
    ]
  
})
export class CommercialPropertyFormComponentF {
  constructor(private controlContainer: ControlContainer) {}

  // A getter to access the parent's FormGroup
  get parentForm(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }}
