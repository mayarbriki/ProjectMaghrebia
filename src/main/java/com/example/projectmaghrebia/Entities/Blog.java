package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;


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
    private BlogType type; // Ensure this is stored as a string

    private String image;  // Store image filename, not base64
    // Add these new fields for scheduling
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime scheduledPublicationDate;
    private boolean published = false; // Default to unpublished
}
