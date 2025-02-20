import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property, PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-properties',
  // Ensure you use "styleUrls" (with an array) if you have external styles
  styleUrls: ['./properties.component.scss'],
  templateUrl: './properties.component.html',
  imports:[FormsModule,CommonModule]
})
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  selectedProperty: Property | null = null;
  isModifyMode = false;

  newProperty: Property = {
    owner_id: '',
    category: '',
    address: '',
    insurance_value: 0,
    policy_type: 'COMPREHENSIVE',
    status: 'ACTIVE'
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe(data => {
      this.properties = data;
      console.log('Loaded properties:', this.properties);
    });
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  addProperty() {
    this.newProperty.owner_id = this.generateUUID(); // Auto-generate owner_id
    console.log('Adding property:', this.newProperty);
    this.propertyService.addProperty(this.newProperty).subscribe(
      response => {
        console.log('Property added:', response);
        alert('Property added successfully!');
        this.loadProperties(); // Refresh list
        // Optionally, clear the add form:
        this.newProperty = {
          owner_id: '',
          category: '',
          address: '',
          insurance_value: 0,
          policy_type: 'COMPREHENSIVE',
          status: 'ACTIVE'
        };
      },
      error => {
        console.error('Error:', error);
        alert('Failed to add property.');
      }
    );
  }

  selectProperty(property: Property) {
    this.selectedProperty = { ...property }; // Clone to avoid reference issues
    this.isModifyMode = true;
    console.log('Selected property for modification:', this.selectedProperty);
  }

  modifyProperty() {
    if (!this.selectedProperty) {
      alert('No property selected for modification.');
      return;
    }
    
    // Temporary hack: if property_id is missing, assign a provided id
    if (!this.selectedProperty.property_id) {
      this.selectedProperty.property_id = "0xc123b94c30fc4795bd315f17827ef1dc";
    }
    
    console.log('Modifying property:', this.selectedProperty);
    this.propertyService.updateProperty(this.selectedProperty.property_id, this.selectedProperty)
      .subscribe(response => {
        console.log('Property updated:', response);
        alert('Property updated successfully!');
        this.loadProperties(); // Refresh the list
        this.isModifyMode = false; // Exit modify mode
      }, error => {
        console.error('Error updating property:', error);
        alert('Failed to update property.');
      });
  }
}
