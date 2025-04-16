package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@ToString(exclude = "comments") // Keep this to avoid toString() issues
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String author;
    private String content;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private BlogType type;

    private String image;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime scheduledPublicationDate;
    private boolean published = false;
    private int likes = 0;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Serializes comments, but stops at blog in Comment
    private List<Comment> comments = new ArrayList<>();

    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setBlog(this);
    }
}