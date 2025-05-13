import { Component, OnInit } from '@angular/core';
import { PropertyType } from '../properties/properties.component';
import { PropertyService } from 'src/app/property.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertySlideshowComponentF } from "../property-slideshow/property-slideshow.component";
import { QRCodeComponent } from 'angularx-qrcode';
import { PropertyCollageComponentF } from "../property-collage/property-collage.component";
import {  SlideshowVideoDownloadComponentF } from "../slideshow-video/slideshow-video.component";

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PropertySlideshowComponentF, QRCodeComponent, PropertyCollageComponentF, SlideshowVideoDownloadComponentF],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponentF implements OnInit {
  property = {
    name: 'Beautiful Property',
    imageFolder: './uploads/images' // Adjust this path as needed
  };
encodeURIComponent(arg0: string) {
throw new Error('Method not implemented.');
}
  properties: any[] = [];
  filteredProperties: any[] = [];
  propertyTypes = Object.values(PropertyType);

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAllProperties().subscribe(
      (data) => {
        this.properties = data;
        this.filteredProperties = data; // reset filter
      },
      (error) => {
        console.error('Error loading properties:', error);
      }
    );
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
    // Implement navigation to edit page if needed
  }
  
  deleteProperty(id: number) {
    this.propertyService.deleteProperty(id).subscribe(
      () => {
        this.refreshProperties();
      },
      (error) => {
        console.error('Error deleting property:', error);
      }
    );
  }
  
  getImageUrl(image: any): string {
    return this.propertyService.getImageUrl(image);
  }


  sendMail(property: any) {
    // Prompt for the recipient's email or name (adjust the prompt message as needed)
    const recipient = window.prompt("Enter recipient email:");
    if (recipient) {
      // Call the service to send the mail
      this.propertyService.sendMail(property, recipient).subscribe(
        (response) => {
          alert("Mail sent successfully!");
        },
        (error) => {
          console.error("Error sending mail:", error);
          alert("Error sending mail.");
        }
      );
    }
  }

  // property-list.component.ts
downloadExcel(): void {
  this.propertyService.downloadExcel().subscribe(
    (response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'properties.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Error downloading Excel file:', error);
      alert('Error downloading Excel file.');
    }
  );
}

  
}
