package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String author;
    private String content;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private BlogType type;  // Now we store different types of blogs
    private String image;

}
