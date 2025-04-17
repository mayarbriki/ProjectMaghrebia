import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class VoiceNavigationService {
  constructor(private router: Router) {}

  startListening(): void {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes('home')) this.router.navigateByUrl('/');
      else if (command.includes('claims')) this.router.navigateByUrl('/claims');
      else if (command.includes('properties')) this.router.navigateByUrl('/propertiesF');
      else if (command.includes('incidents')) this.router.navigateByUrl('/incidents');
      else if (command.includes('services')) this.router.navigateByUrl('/services');
      else if (command.includes('login')) this.router.navigateByUrl('/signin');
      else if (command.includes('sign up') || command.includes('signup')) this.router.navigateByUrl('/signup');
      else alert('Command not recognized.');
    };

    recognition.start();
  }
}
