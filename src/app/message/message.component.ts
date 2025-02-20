import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  imports: [HttpClientModule, CommonModule] // ✅ IMPORT MODULES
})
export class MessageComponent implements OnInit {
  message: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMessage().subscribe(
      (response: any) => {
        this.message = response.message; // API should return { "message": "Hello from Spring Boot!" }
      },
      (error) => {
        console.error('Error fetching message:', error);
      }
    );
  }
}
