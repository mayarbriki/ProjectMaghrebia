import { Component } from '@angular/core';
import { VoiceNavigationService } from './voice-navigation.service';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
constructor(    
  private voiceNav: VoiceNavigationService
){}

startVoice(): void {
  this.voiceNav.startListening();
}
}
