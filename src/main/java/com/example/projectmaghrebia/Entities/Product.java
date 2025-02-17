package com.example.projectmaghrebia.Entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
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

    private String description;

    private String name;


    private String fileName;


}