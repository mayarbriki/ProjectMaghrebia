package com.example.projectmaghrebiauser.Entities;

import com.example.projectmaghrebiauser.Entities.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private double accountBalance;
    private String phoneNumber;
    private String address;
    private String category;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String image;

    @ElementCollection
    @CollectionTable(name = "user_bookmarked_product_ids", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "product_id")
    private List<Long> bookmarkedProductIds = new ArrayList<>();

    // New attribute to store bookmarked product categories
    @ElementCollection
    @CollectionTable(name = "user_bookmarked_service_categories", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "category")
    private List<String> bookmarkedServiceCategories = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_coupon_codes", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "coupon_code")
    private List<String> couponCodes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_coupon_discounts", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "discount_amount")
    private List<Double> couponDiscountAmounts = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_coupon_usage", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "used")
    private List<Boolean> couponUsedStatuses = new ArrayList<>();
}