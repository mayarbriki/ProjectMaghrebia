import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isChatOpen = false;
  userMessage: string = '';
  messages: { text: string; sender: string }[] = [];

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, sender: 'user' });
      this.userMessage = '';

      setTimeout(() => {
        this.messages.push({ text: "I'm a bot, how can I assist you?", sender: 'bot' });
      }, 1000);
    }
  }
}
