import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property, PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
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

  // Helper: Generate a UUID for testing (owner_id)
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  addProperty() {
    // For testing, auto-generate an owner_id if empty
    if (!this.newProperty.owner_id) {
      this.newProperty.owner_id = this.generateUUID();
    }
    console.log('Adding property:', this.newProperty);
    this.propertyService.addProperty(this.newProperty).subscribe(
      response => {
        console.log('Property added:', response);
        alert('Property added successfully!');
        this.loadProperties();
        // Reset the form
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
        console.error('Error adding property:', error);
        alert('Failed to add property.');
      }
    );
  }

  selectProperty(property: Property) {
    this.selectedProperty = { ...property };
    this.isModifyMode = true;
    console.log('Selected property for modification:', this.selectedProperty);
  }

  modifyProperty() {
    if (!this.selectedProperty || !this.selectedProperty.property_id) {
      alert('No property selected for modification.');
      return;
    }
    this.propertyService.updateProperty(this.selectedProperty.property_id, this.selectedProperty)
      .subscribe(response => {
        console.log('Property updated:', response);
        alert('Property updated successfully!');
        this.loadProperties();
        this.isModifyMode = false;
      }, error => {
        console.error('Error updating property:', error);
        alert('Failed to update property.');
      });
  }

  deleteProperty(id: string | undefined) {
    if (!id) {
      alert('No property id provided.');
      return;
    }
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(id).subscribe(
        () => {
          alert('Property deleted successfully!');
          this.loadProperties();
        },
        error => {
          console.error('Error deleting property:', error);
          alert('Failed to delete property.');
        }
      );
    }
  }
}
