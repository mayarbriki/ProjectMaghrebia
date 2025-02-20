import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-contrats',
  standalone: true,
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.scss']
})
export class ContratsComponent implements OnInit {
  private messageService = inject(MessageService);
  message: string = '';

  ngOnInit() {
    console.log('Fetching message...');

    this.messageService.getMessage().subscribe(
      response => {
        console.log('Message received:', response);
        this.message = response;
      },
      error => {
        console.error('Error fetching message:', error);
      }
    );
  }
}
