import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService, Incident } from '../../../incident.service';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import jsPDF from 'jspdf';
import { icon, latLng, Map, marker, Marker, tileLayer, latLngBounds, LatLngBounds } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  standalone: true,
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, HeaderFrontComponent, LeafletModule]
})
export class IncidentFormComponent implements OnInit {
  incidentForm!: FormGroup;
  propertyId!: number;
  isLoading = false;
  today = new Date().toISOString().split('T')[0];

  map!: Map;
  mainMarker!: Marker;

  maxBounds: LatLngBounds = latLngBounds(latLng(-90, -180), latLng(90, 180));

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng(34, 9),
    maxBounds: this.maxBounds
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.propertyId = +this.route.snapshot.paramMap.get('propertyId')!;
    this.initForm();
  }

  private initForm(): void {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      dateOfIncident: ['', [Validators.required, this.pastDateValidator]],
      locationDetails: ['', Validators.maxLength(200)],
      severity: ['', Validators.required],
      incidentCategory: ['', Validators.required],
      incidentCause: ['', Validators.maxLength(200)],
      policeReportFiled: [false],
      insuranceClaimFiled: [false],
      userEmail: ['', [Validators.required, Validators.email]],
      userPhone: ['', [Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      faultAcknowledged: [false],
      needsAssessment: [true],
      latitude: [34, Validators.required],
      longitude: [9, Validators.required]
    });
  }

  private pastDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { futureDate: true };
  }

  submitIncident(): void {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;

    const formValue = this.incidentForm.value;
    const incident: Incident = {
      ...formValue,
      property: { id: this.propertyId },
      dateOfIncident: new Date(formValue.dateOfIncident).toISOString()
    };

    this.incidentService.createIncident(incident).subscribe({
      next: () => {
        alert('Incident submitted successfully!');
        this.generateIncidentPDF(incident);
        this.router.navigate(['/properties', this.propertyId]);
      },
      error: (err) => {
        console.error('Error submitting incident:', err);
        alert('Error submitting incident. Please try again.');
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  generateIncidentPDF(data: Incident): void {
    const doc = new jsPDF({ orientation: 'portrait' });
    const lineHeight = 8;
    let y = 20;

    doc.setFontSize(16);
    doc.text('Incident Report', 14, y);
    y += 10;

    doc.setFontSize(12);
    const paragraphs = [
      `On ${data.dateOfIncident}, an incident titled "${data.title}" occurred at the following location: ${data.locationDetails || 'unspecified location'}.`,
      `The description provided by the reporter states: "${data.description}"`,
      `Severity level: "${data.severity}" | Category: "${data.incidentCategory}"`,
      data.incidentCause ? `Probable cause: "${data.incidentCause}"` : '',
      `Contact: ${data.userEmail}${data.userPhone ? ` or ${data.userPhone}` : ''}`,
      `Police Report: ${data.policeReportFiled ? 'Yes' : 'No'} | Insurance: ${data.insuranceClaimFiled ? 'Yes' : 'No'}`,
      `Fault Acknowledged: ${data.faultAcknowledged ? 'Yes' : 'No'} | Needs Assessment: ${data.needsAssessment ? 'Yes' : 'No'}`,
      `Submitted: ${data.submittedAt ?? new Date().toISOString()}`
    ];

    paragraphs.forEach(p => {
      if (p) {
        const lines = doc.splitTextToSize(p, 180);
        doc.text(lines, 14, y);
        y += lines.length * lineHeight;
      }
    });

    doc.save(`incident-report-${data.title}.pdf`);
  }

  onMapReady(map: Map) {
    this.map = map;
    const lat = this.incidentForm.get('latitude')?.value || 34;
    const lng = this.incidentForm.get('longitude')?.value || 9;

    this.map.setView([lat, lng], 8);

    this.mainMarker = marker([lat, lng], {
      draggable: true,
      icon: icon({
        iconUrl: 'assets/335079-200.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(this.map);

    this.mainMarker.on('moveend', () => {
      const coords = this.mainMarker.getLatLng();
      this.incidentForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng
      });
    });

    this.map.on('click', (e: any) => {
      const coords = e.latlng;
      this.mainMarker.setLatLng(coords);
      this.incidentForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng
      });
    });
  }

  updateMarkerPosition(): void {
    if (!this.map || !this.mainMarker) return;
    const lat = this.incidentForm.get('latitude')?.value;
    const lng = this.incidentForm.get('longitude')?.value;
    const newPosition = latLng(lat, lng);
    this.mainMarker.setLatLng(newPosition);
    this.map.setView(newPosition, this.map.getZoom());
  }

  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.incidentForm.patchValue({ latitude: lat, longitude: lng });
          if (this.map && this.mainMarker) {
            const newPosition = latLng(lat, lng);
            this.mainMarker.setLatLng(newPosition);
            this.map.setView(newPosition, this.map.getZoom());
          }
        },
        () => alert('Unable to retrieve your location.')
      );
    } else {
      alert('Geolocation is not supported.');
    }
  }
}
