package com.example.projectmaghrebia.Entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PropertyDTO {
    private Long id;
    private String address;
    private PropertyType propertyType;
    private Long userId; // Only include the user ID, not the entire User object

    // Getters and setters
}