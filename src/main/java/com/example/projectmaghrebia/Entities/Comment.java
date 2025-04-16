package com.example.projectmaghrebia.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@ToString(exclude = "blog") // Keep this to avoid toString() issues
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private String user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean approved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    @JsonBackReference // Prevents serialization of blog in Comment
    private Blog blog;
}