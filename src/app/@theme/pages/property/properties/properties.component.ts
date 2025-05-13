import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PropertyListComponent } from '../property-list/property-list.component';
import { CarPropertyFormComponent } from '../car-property-form/car-property-form.component';
import { ResidencePropertyFormComponent } from '../residence-property-form/residence-property-form.component';
import { LifePropertyFormComponent } from '../life-property-form/life-property-form.component';
import { TravelPropertyFormComponent } from '../travel-property-form/travel-property-form.component';
import { CommercialPropertyFormComponent } from '../commercial-property-form/commercial-property-form.component';
import { icon, latLng, Map, marker, Marker, tileLayer, LatLngBounds, latLngBounds } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// Define the PropertyType enum
export enum PropertyType {
  CAR = 'CAR',
  RESIDENCE = 'RESIDENCE',
  LIFE = 'LIFE',
  TRAVEL = 'TRAVEL',
  COMMERCIAL = 'COMMERCIAL'
}

// Define a simple interface for Property just for this component
interface Property {
  id?: number;
  type: PropertyType;
  name: string;
  description: string;
  estimatedValue?: number;
  // Address fields
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Car specific fields
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  // Residence specific fields
  squareFootage?: number;
  yearBuilt?: number;
  constructionType?: string;
  // Life insurance specific fields
  fullName?: string;
  dateOfBirth?: string;
  occupation?: string;
  smoker?: boolean;
  // Travel insurance specific fields
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  travelPurpose?: string;
  // Commercial insurance specific fields
  businessName?: string;
  businessType?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  // Images
  images?: any[];
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PropertyListComponent,
    // Import your new child components
    CarPropertyFormComponent,
    ResidencePropertyFormComponent,
    LifePropertyFormComponent,
    TravelPropertyFormComponent,
    CommercialPropertyFormComponent
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit {
  propertyForm!: FormGroup;
   propertyTypes = Object.values(PropertyType);
   isEditMode = false;
   propertyId?: number;
   selectedFiles: File[] = [];
   existingImages: any[] = [];
   imagesToDelete: number[] = [];
   properties: Property[] = [];
   filteredProperties: Property[] = [];
 
   map!: Map;
   mainMarker!: Marker;
   
   // Define world boundaries for max bounds
   maxBounds: LatLngBounds = latLngBounds(
     latLng(-90, -180),
     latLng(90, 180)
   );
   
   // Define map options
   options = {
     layers: [
       tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
         attribution: '© OpenStreetMap contributors',
         maxZoom: 19,
         minZoom: 3
       })
     ],
     zoom: 5,
     center: latLng(34, 9),
     zoomControl: true,
     zoomAnimaion:true,
     scrollWheelZoom: true,
   };
 
   constructor(
     private fb: FormBuilder,
     private propertyService: PropertyService,
     private route: ActivatedRoute,
     private router: Router
   ) {}
 
   ngOnInit(): void {
     this.initForm();
 
     this.route.params.subscribe(params => {
       if (params['id']) {
         this.isEditMode = true;
         this.propertyId = +params['id'];
         this.loadProperty(this.propertyId);
       }
     });
 
     // Listen for changes to property type
     this.propertyForm.get('type')?.valueChanges.subscribe(type => {
       this.updateFormValidators(type);
     });
 
     this.loadProperties();
   }
 
   initForm(): void {
     this.propertyForm = this.fb.group({
       type: [null, Validators.required],
       name: ['', Validators.required],
       description: ['', Validators.required],
       estimatedValue: [0],
       // Car
       make: [''],
       model: [''],
       year: [null],
       licensePlate: [''],
       vin: [''],
       // Residence
       addressLine1: [''],
       addressLine2: [''],
       city: [''],
       state: [''],
       postalCode: [''],
       country: [''],
       squareFootage: [null],
       yearBuilt: [null],
       constructionType: [''],
       // Life
       fullName: [''],
       dateOfBirth: [''],
       occupation: [''],
       smoker: [false],
       // Travel
       destination: [''],
       departureDate: [''],
       returnDate: [''],
       travelPurpose: [''],
       // Commercial
       businessName: [''],
       businessType: [''],
       numberOfEmployees: [null],
       annualRevenue: [null],
       // Location
       latitude: [34, Validators.required],
       longitude: [9, Validators.required]
     });
   }
 
   loadProperty(id: number): void {
     // Use the correct service method name (getPropertyById)
     this.propertyService.getPropertyById(id).subscribe(
       (property) => {
         this.propertyForm.patchValue(property);
         if (property.images && property.images.length > 0) {
           this.existingImages = property.images;
         }
         
         // Update map if it's already initialized
         if (this.map && property.latitude && property.longitude) {
           setTimeout(() => {
             this.updateMarkerPosition();
           }, 500);
         }
       },
       (error) => {
         console.error('Error loading property:', error);
       }
     );
   }
 
   loadProperties() {
     this.propertyService.getAllProperties().subscribe(
       (data: Property[]) => {
         this.properties = data;
         this.filteredProperties = data;
       },
       (error) => {
         console.error('Error loading properties:', error);
       }
     );
   }
 
   updateFormValidators(type: PropertyType): void {
     // Clear validators for all controls (except shared ones)
     Object.keys(this.propertyForm.controls).forEach(key => {
       if (!['type', 'name', 'description', 'estimatedValue'].includes(key)) {
         this.propertyForm.get(key)?.clearValidators();
         this.propertyForm.get(key)?.updateValueAndValidity({ emitEvent: false });
       }
     });
 
     switch (type) {
       case PropertyType.CAR:
         this.propertyForm.get('make')?.setValidators([Validators.required]);
         this.propertyForm.get('model')?.setValidators([Validators.required]);
         this.propertyForm.get('year')?.setValidators([Validators.required]);
         this.propertyForm.get('licensePlate')?.setValidators([Validators.required]);
         break;
       case PropertyType.RESIDENCE:
         this.propertyForm.get('addressLine1')?.setValidators([Validators.required]);
         this.propertyForm.get('city')?.setValidators([Validators.required]);
         this.propertyForm.get('state')?.setValidators([Validators.required]);
         this.propertyForm.get('postalCode')?.setValidators([Validators.required]);
         this.propertyForm.get('country')?.setValidators([Validators.required]);
         this.propertyForm.get('squareFootage')?.setValidators([Validators.required]);
         this.propertyForm.get('yearBuilt')?.setValidators([Validators.required]);
         this.propertyForm.get('latitude')?.setValidators([Validators.required]);
         this.propertyForm.get('longitude')?.setValidators([Validators.required]);
         break;
       case PropertyType.LIFE:
         this.propertyForm.get('fullName')?.setValidators([Validators.required]);
         this.propertyForm.get('dateOfBirth')?.setValidators([Validators.required]);
         this.propertyForm.get('occupation')?.setValidators([Validators.required]);
         break;
       case PropertyType.TRAVEL:
         this.propertyForm.get('destination')?.setValidators([Validators.required]);
         this.propertyForm.get('departureDate')?.setValidators([Validators.required]);
         this.propertyForm.get('returnDate')?.setValidators([Validators.required]);
         this.propertyForm.get('travelPurpose')?.setValidators([Validators.required]);
         break;
       case PropertyType.COMMERCIAL:
         this.propertyForm.get('businessName')?.setValidators([Validators.required]);
         this.propertyForm.get('businessType')?.setValidators([Validators.required]);
         this.propertyForm.get('addressLine1')?.setValidators([Validators.required]);
         this.propertyForm.get('city')?.setValidators([Validators.required]);
         this.propertyForm.get('numberOfEmployees')?.setValidators([Validators.required]);
         this.propertyForm.get('latitude')?.setValidators([Validators.required]);
         this.propertyForm.get('longitude')?.setValidators([Validators.required]);
         break;
     }
   
     Object.keys(this.propertyForm.controls).forEach(key => {
       this.propertyForm.get(key)?.updateValueAndValidity({ emitEvent: false });
     });
     
     // If map is needed for this property type, ensure it's refreshed
     if ((type === PropertyType.RESIDENCE || type === PropertyType.COMMERCIAL) && this.map) {
       setTimeout(() => {
         this.map.invalidateSize();
       }, 500);
     }
   }
 
   onFileSelect(event: any): void {
     if (event.target.files.length > 0) {
       for (let i = 0; i < event.target.files.length; i++) {
         this.selectedFiles.push(event.target.files[i]);
       }
     }
   }
 
   removeSelectedFile(index: number): void {
     this.selectedFiles.splice(index, 1);
   }
 
   markImageForDeletion(imageId: number): void {
     this.imagesToDelete.push(imageId);
     this.existingImages = this.existingImages.filter(img => img.id !== imageId);
   }
 
   submitForm(): void {
     if (this.propertyForm.invalid) {
       this.markFormGroupTouched(this.propertyForm);
       return;
     }
     const propertyData: Property = this.propertyForm.value;
 
     if (this.isEditMode && this.propertyId) {
       this.imagesToDelete.forEach(imageId => {
         this.propertyService.deleteImage(imageId).subscribe();
       });
       this.propertyService.updateProperty(this.propertyId, propertyData, this.selectedFiles).subscribe(
         () => {
           this.router.navigate(['/properties']);
         },
         (error) => {
           console.error('Error updating property:', error);
         }
       );
     } else {
       this.propertyService.createProperty(propertyData, this.selectedFiles).subscribe(
         () => {
           this.router.navigate(['admin/properties']);
         },
         (error) => {
           console.error('Error creating property:', error);
         }
       );
     }
   }
 
   getImageUrl(image: any): string {
     return this.propertyService.getImageUrl(image);
   }
 
   markFormGroupTouched(formGroup: FormGroup) {
     Object.values(formGroup.controls).forEach(control => {
       control.markAsTouched();
       if (control instanceof FormGroup) {
         this.markFormGroupTouched(control);
       }
     });
   }
 
   cancel(): void {
     this.router.navigate(['/properties']);
   }
 
   filterProperties(event: any) {
     const selectedType = event.target.value;
     this.filteredProperties = selectedType 
       ? this.properties.filter(p => p.type === selectedType)
       : this.properties;
   }
 
   refreshProperties() {
     this.loadProperties();
   }
 
   editProperty(id: number) {
     this.router.navigate([`/properties/edit/${id}`]);
   }
 
   deleteProperty(id: number) {
     this.propertyService.deleteProperty(id).subscribe(
       () => {
         this.loadProperties();
       },
       (error) => {
         console.error('Error deleting property:', error);
       }
     );
   }
 
   // Map-related code
   onMapReady(map: Map) {
     this.map = map;
     
     // Immediately invalidate size to ensure proper rendering
     this.map.invalidateSize();
     
     const currentLat = this.propertyForm.get('latitude')?.value || 34;
     const currentLng = this.propertyForm.get('longitude')?.value || 9;
     
     // Set the view after ensuring map is properly sized
     this.map.setView([currentLat, currentLng], 8);
 
     // Create a draggable marker with custom icon
     this.mainMarker = marker([currentLat, currentLng], {
       draggable: true,
       icon: icon({
         iconUrl: 'assets/marker-icon.png',
         shadowUrl: 'assets/marker-shadow.png',
         iconSize: [25, 41],
         iconAnchor: [12, 41],
         popupAnchor: [1, -34],
         shadowSize: [41, 41]
       })
     }).addTo(this.map);
 
     // Update form lat/long whenever the marker is dragged
     this.mainMarker.on('moveend', () => {
       const coords = this.mainMarker.getLatLng();
       this.propertyForm.patchValue({
         latitude: coords.lat,
         longitude: coords.lng
       });
     });
 
     // Update marker position when map is clicked
     this.map.on('click', (e: any) => {
       const coords = e.latlng;
       this.mainMarker.setLatLng(coords);
       this.propertyForm.patchValue({
         latitude: coords.lat,
         longitude: coords.lng
       });
     });
 
     // Set max bounds with high viscosity to prevent dragging outside
     this.map.setMaxBounds(this.maxBounds);
 
     // Invalidate the map size after a longer delay to ensure all DOM elements are properly loaded
     setTimeout(() => {
       this.map.invalidateSize();
     }, 500);
     
     // Add event listener for when the tab changes to refresh map
     this.map.on('resize', () => {
       this.map.invalidateSize();
     });
   }
 
   updateMarkerPosition(): void {
     if (!this.map || !this.mainMarker) return;
     
     const lat = this.propertyForm.get('latitude')?.value;
     const lng = this.propertyForm.get('longitude')?.value;
     
     if (lat && lng) {
       const newPosition = latLng(lat, lng);
       this.mainMarker.setLatLng(newPosition);
       this.map.setView(newPosition, this.map.getZoom());
       
       // Force map to redraw
       this.map.invalidateSize();
     }
   }
 }