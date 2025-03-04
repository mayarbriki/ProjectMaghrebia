package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduct;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String description; // Mandatory field
    private String name;        // Mandatory field
    private String fileName;    // Mandatory field
    private Double price;       // Mandatory field
    private Long views = 0L;    // Default to 0

    @Transient
    private List<Map<String, Object>> paymentPlans;

    // Method to generate payment plans, using Optional internally
    public List<Map<String, Object>> getPaymentPlans() {
        return Optional.ofNullable(price)
                .filter(p -> p > 0)
                .map(p -> {
                    List<Map<String, Object>> plans = new ArrayList<>();

                    // Full payment
                    Map<String, Object> fullPayment = new HashMap<>();
                    fullPayment.put("name", "Full Payment");
                    fullPayment.put("amount", p);
                    fullPayment.put("duration", 1);
                    plans.add(fullPayment);

                    // 3-month plan
                    Map<String, Object> threeMonth = new HashMap<>();
                    threeMonth.put("name", "3-Month Plan");
                    threeMonth.put("amount", p / 3);
                    threeMonth.put("duration", 3);
                    plans.add(threeMonth);

                    // 6-month plan
                    Map<String, Object> sixMonth = new HashMap<>();
                    sixMonth.put("name", "6-Month Plan");
                    sixMonth.put("amount", p / 6);
                    sixMonth.put("duration", 6);
                    plans.add(sixMonth);

                    return plans;
                })
                .orElseGet(ArrayList::new); // Empty list if price is null or <= 0
    }
}