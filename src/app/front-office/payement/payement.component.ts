import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { PayementService } from 'src/app/payement.service';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.scss']
})
export class PayementComponent implements OnInit {
  @Input() transactionId!: number;
  @Input() amount!: number;
  @Output() paymentCompleted = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>(); // ✅ Added event emitter for closing

  stripe: any;
  card: any;

  constructor(private payementService: PayementService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51Qw8aeQtCKlKlGPaUmJ1oF2ih3xqwR0l0vecpB3K7NeWAkrwjSzwrq1iU4gNAr6dLMZTIY0LaQa0HTEgH2WJndXU00bG2XKLCi');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async payWithCard() {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.error("❌ Payment error:", error);
      alert("❌ Payment error: " + error.message);
      return;
    }

    console.log("✅ Stripe Token Generated:", token.id);

    this.payementService.chargeCard(token.id, this.transactionId, this.amount).subscribe(
      (response) => {
        if (response.status === "success") {
          console.log("✅ Redirecting to Stripe:", response.checkoutUrl);
          window.location.href = response.checkoutUrl; // ✅ Redirect user to Stripe Checkout
        } else {
          alert("❌ Payment failed: " + response.message);
        }
      },
      (error) => {
        console.error("❌ Payment failed:", error);
        alert("❌ Payment failed. Check console for details.");
      }
    );
  }

  // ✅ Close Payment Modal Function
  closePayment(): void {
    console.log("🔴 Payment modal closed!");
    this.close.emit(); // Notify parent to close the payment modal
  }
}
