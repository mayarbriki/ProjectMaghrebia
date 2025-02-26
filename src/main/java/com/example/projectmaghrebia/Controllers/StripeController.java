package com.example.projectmaghrebia.Controllers; // ✅ Ensure this is the correct package

import com.example.projectmaghrebia.Services.StripeService;
import com.stripe.model.checkout.Session;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin("*") // Allows Angular frontend to access the backend
public class StripeController {

    @Autowired
    private StripeService stripeService; // ✅ Ensure StripeService is correctly injected

    @PostMapping("/charge")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> request) {
        try {
            double amount = Double.parseDouble(request.get("amount").toString());

            // ✅ Ensure createCheckoutSession method exists in StripeService
            Session session = stripeService.createCheckoutSession(amount);
            String stripeCheckoutUrl = session.getUrl(); // ✅ Get the correct Stripe Checkout URL

            System.out.println("🔗 Stripe Checkout URL: " + stripeCheckoutUrl); // Debugging

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Payment session created!");
            response.put("checkoutUrl", stripeCheckoutUrl); // ✅ Send URL to frontend

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(400).body(Map.of(
                    "status", "error",
                    "message", "Payment failed: " + e.getMessage()
            ));
        }
    }
}
