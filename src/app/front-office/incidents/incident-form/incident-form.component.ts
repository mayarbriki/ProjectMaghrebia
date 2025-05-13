import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService, Incident } from '../../../incident.service';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import jsPDF from 'jspdf';
import { icon, latLng, Map, marker, Marker, tileLayer, latLngBounds, LatLngBounds } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClient } from '@angular/common/http';
import { VoiceNavigationService } from '../../header-front/voice-navigation.service';

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
  voiceTranscription: string = '';
  recognition: any;
  
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
    private incidentService: IncidentService,
    private http: HttpClient,
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
      longitude: [9, Validators.required],
      mediaFiles: [null],

    });
  }

  private pastDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { futureDate: true };
  }

  async submitIncident(): Promise<void> {
    // Validate form
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
  
    this.isLoading = true;
  
    // Prepare incident data
    const formValue = this.incidentForm.value;
    const incident: Incident = {
      ...formValue,
      property: { id: this.propertyId },
      dateOfIncident: new Date(formValue.dateOfIncident).toISOString()
    };
  
    // ✅ Generate static map image URL from OpenStreetMap
    const lat = formValue.latitude;
    const lng = formValue.longitude;
    const mapImageUrl = this.generateLocationIQStaticImageUrl(lat, lng);  
    try {
      await this.submitIncidentData(incident);
      alert('Incident submitted successfully!');
      this.generateIncidentPDF(incident, mapImageUrl);
      this.router.navigate(['/properties', this.propertyId]);
    } catch (error) {
      console.error('Incident submission failed:', error);
      alert('Incident submission failed.');
    } finally {
      this.isLoading = false;
    }
  }
  
  private submitIncidentData(incident: Incident, mapImage?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.incidentService.createIncidentWithFiles(incident, this.selectedFiles).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }
  
  generateIncidentPDF(data: Incident, mapImageUrl?: string): void {
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
      this.voiceTranscription ? `🗣️ Dictated description (voice): "${this.voiceTranscription}"` : '',
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
  
    if (mapImageUrl) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = mapImageUrl;
  
      image.onload = () => {
        const pageHeight = doc.internal.pageSize.height;
        if (y + 80 > pageHeight) {
          doc.addPage();
          y = 20;
        }
  
        doc.text('Map Preview:', 14, y + 10);
        doc.addImage(image, 'PNG', 14, y + 15, 180, 100);
        doc.save(`incident-report-${data.title}.pdf`);
      };
  
      image.onerror = () => {
        console.error('Map image failed to load. Saving PDF without map.');
        doc.save(`incident-report-${data.title}.pdf`);
      };
    } else {
      doc.save(`incident-report-${data.title}.pdf`);
    }
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





  previewUrls: string[] = [];
selectedFiles: File[] = [];

onFileChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    this.selectedFiles = Array.from(target.files);
    this.previewUrls = [];

    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrls.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }
}

isImage(fileUrl: string): boolean {
  return fileUrl.match(/image\//i) != null;
}

isVideo(fileUrl: string): boolean {
  return fileUrl.match(/video\//i) != null;
}


private generateLocationIQStaticImageUrl(lat: number, lng: number): string {
  const apiKey = 'pk.f6cff4e27cbf77dec5fb32896647a75c'; // Use your own LocationIQ key
  return `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${lat},${lng}&zoom=18&size=600x400&markers=icon:large-red-cutout|${lat},${lng}`;
}


startVoiceInput() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  this.recognition = new SpeechRecognition();
  this.recognition.lang = 'en-US'; // You can change to 'fr-FR' or 'ar' as needed
  this.recognition.continuous = false;
  this.recognition.interimResults = false;

  this.recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join('');

    // Append to description field and save transcript
    const currentDescription = this.incidentForm.get('description')?.value || '';
    this.incidentForm.patchValue({ description: currentDescription + ' ' + transcript });
    this.voiceTranscription = transcript;
  };

  this.recognition.start();
}

stopVoiceInput() {
  if (this.recognition) {
    this.recognition.stop();
  }
}

translateVoiceTranscriptionLibre(targetLang: string = 'en'): void {
  const url = 'https://libretranslate.de/translate';
  const body = {
    q: this.voiceTranscription,
    source: 'auto',
    target: targetLang,
    format: 'text'
  };

  this.http.post<any>(url, body).subscribe({
    next: (res) => {
      this.voiceTranscription = res.translatedText;
      alert(`Translated to ${targetLang.toUpperCase()} ✅`);
    },
    error: (err) => {
      console.error('LibreTranslate error:', err);
      alert('Translation failed. Check your internet or try later.');
    }
  });
}


}
