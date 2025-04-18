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
  lastBotContext: string | null = null;
  assessmentStep: number = 0;
  assessmentAnswers: string[] = [];

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  closeChat(event: Event) {
    event.stopPropagation();
    this.isChatOpen = false;
  }

  sendMessage() {
    const userInput = this.userMessage.trim().toLowerCase();

    if (userInput) {
      this.messages.push({ text: this.userMessage, sender: 'user' });
      this.userMessage = '';

      setTimeout(() => {
        let botResponse = "I'm a bot, how can I assist you?";

        // === SUIVI DE L'ASSESSMENT ===
        if (this.lastBotContext === 'claim-assessment') {
          this.assessmentAnswers.push(userInput);
          this.assessmentStep++;

          if (this.assessmentStep === 1) {
            botResponse = "📅 When did the incident happen?";
          } else if (this.assessmentStep === 2) {
            botResponse = "📍 Where did it occur?";
          } else if (this.assessmentStep === 3) {
            botResponse = "📸 Do you have any supporting documents or photos?";
          } else {
            botResponse = "✅ Thank you for the information. Our team will review your claim and contact you shortly.";
            this.lastBotContext = null;
            this.assessmentStep = 0;
            this.assessmentAnswers = [];
          }

        // === RÉPONSES GÉNÉRALES ===
        } else if (['hello', 'hi', 'hey', 'salem'].some(word => userInput.includes(word))) {
          botResponse = 'Hello! 👋 How can I help you with your insurance today?';
        } else if (userInput.includes('time')) {
          const now = new Date();
          botResponse = `🕒 The current time is ${now.toLocaleTimeString()}`;
        } else if (userInput.includes('date')) {
          const today = new Date();
          botResponse = `📅 Today's date is ${today.toLocaleDateString()}`;
        } else if (userInput.includes('thanks') || userInput.includes('thank')) {
          botResponse = "You're welcome! 😊";

        // Types d’assurance
        } else if (
          ['insurance', 'types', 'offer', 'type', 'assurance'].some(word => userInput.includes(word))
        ) {
          botResponse = "We offer health, car, home and life insurance. Which one are you interested in?";
          this.lastBotContext = 'insurance-types';

        } else if (this.lastBotContext === 'insurance-types' && userInput.includes('car')) {
          botResponse = "🚗 Car insurance covers accidents, theft, and damages to your vehicle. You can customize it with liability, collision, or full coverage.";
          this.lastBotContext = null;
        } else if (this.lastBotContext === 'insurance-types' && userInput.includes('home')) {
          botResponse = "🏠 Home insurance protects your house and belongings from fire, theft, natural disasters, and more.";
          this.lastBotContext = null;
        } else if (this.lastBotContext === 'insurance-types' && userInput.includes('life')) {
          botResponse = "❤️ Life insurance provides financial support to your loved ones in case of your passing. We offer term and whole life policies.";
          this.lastBotContext = null;

        // DÉMARRER L’ASSESSMENT
        } else if (['claim', 'file', 'incident'].some(word => userInput.includes(word))) {
          botResponse = "📝 Let’s assess your claim. First, what type of incident are you reporting? (e.g. accident, fire, theft)";
          this.lastBotContext = 'claim-assessment';
          this.assessmentStep = 0;
          this.assessmentAnswers = [];

        // Autres cas
        } else if (['documents', 'document', 'papers'].some(word => userInput.includes(word))) {
          botResponse = "You’ll need a valid ID, your insurance policy number, and any documents related to the incident like photos or police reports.";
        } else if (['contact', 'phone', 'email'].some(word => userInput.includes(word))) {
          botResponse = "You can reach us at 📞 1-800-INSURE or ✉️ support@insurance.com.";
        } else if (userInput.includes('cancel') && userInput.includes('policy')) {
          botResponse = "To cancel your policy, please contact our support team. They’ll guide you through the process.";
        } else if (userInput.includes('quote')) {
          botResponse = "You can get a free quote by visiting our website or by telling me what kind of insurance you're looking for.";
        }

        this.messages.push({ text: botResponse, sender: 'bot' });
      }, 500);
    }
  }
}
