import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Incident, IncidentService } from 'src/app/incident.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  selectedIncident: Incident | null = null;
  isModifyMode = false;

  newIncident: Incident = {
    reporter_id: '',
    linked_property: '',
    category: 'ACCIDENT',
    details: '',
    occurrence_date: '',
    resolution_status: 'PENDING_REVIEW', // Ensure this matches backend enum
    evidence: ''
  };

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents() {
    this.incidentService.getIncidents().subscribe(data => {
      this.incidents = data;
      console.log('Loaded incidents:', this.incidents);
    });
  }

  // Convert datetime-local string to ISO string
  convertToISO(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString();
  }

  // Optional: Generate UUID for testing if needed
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  addIncident() {
    if (this.newIncident.occurrence_date) {
      this.newIncident.occurrence_date = this.convertToISO(this.newIncident.occurrence_date);
    } else {
      alert('Occurrence Date is required.');
      return;
    }

    if (!this.newIncident.reporter_id) {
      this.newIncident.reporter_id = this.generateUUID();
    }
    if (!this.newIncident.linked_property) {
      this.newIncident.linked_property = this.generateUUID();
    }

    console.log('Payload being sent:', this.newIncident);
    this.incidentService.addIncident(this.newIncident).subscribe(
      response => {
        console.log('Incident added:', response);
        alert('Incident added successfully!');
        this.loadIncidents();
        // Reset form with default values
        this.newIncident = {
          reporter_id: '',
          linked_property: '',
          category: 'ACCIDENT',
          details: '',
          occurrence_date: '',
          resolution_status: 'PENDING_REVIEW',
          evidence: ''
        };
      },
      error => {
        console.error('Error adding incident:', error);
        alert('Failed to add incident.');
      }
    );
  }

  selectIncident(incident: Incident) {
    this.selectedIncident = { ...incident };
    if (this.selectedIncident.occurrence_date) {
      const date = new Date(this.selectedIncident.occurrence_date);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      this.selectedIncident.occurrence_date = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    this.isModifyMode = true;
    console.log('Selected incident for modification:', this.selectedIncident);
  }

  modifyIncident() {
    if (!this.selectedIncident || !this.selectedIncident.incident_id) {
      alert('No incident selected for modification.');
      return;
    }
    if (this.selectedIncident.occurrence_date) {
      this.selectedIncident.occurrence_date = this.convertToISO(this.selectedIncident.occurrence_date);
    }
    this.incidentService.updateIncident(this.selectedIncident.incident_id, this.selectedIncident)
      .subscribe(response => {
        console.log('Incident updated:', response);
        alert('Incident updated successfully!');
        this.loadIncidents();
        this.isModifyMode = false;
      }, error => {
        console.error('Error updating incident:', error);
        alert('Failed to update incident.');
      });
  }

  // New: Delete incident method
  deleteIncident(id: string | undefined) {
    if (!id) {
      alert('No incident id provided.');
      return;
    }
    if (confirm('Are you sure you want to delete this incident?')) {
      this.incidentService.deleteIncident(id).subscribe(
        () => {
          alert('Incident deleted successfully!');
          this.loadIncidents();
        },
        error => {
          console.error('Error deleting incident:', error);
          alert('Failed to delete incident.');
        }
      );
    }
  }
}
