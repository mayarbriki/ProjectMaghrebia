package com.example.projectmaghrebia.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.twilio.rest.chat.v1.service.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainingId;

    private String title;
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private String imageUrl;

    private String location;


    @Enumerated(EnumType.STRING)
    private Mode mode;

    private LocalDateTime createdAt;
    private String coursePdfUrl;
    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL)
    @JsonManagedReference // ← gère l'affichage des quiz dans Training
    private List<Quiz> quizzes;


    public String getCoursePdfUrl() {
        return coursePdfUrl;
    }

    public void setCoursePdfUrl(String coursePdfUrl) {
        this.coursePdfUrl = coursePdfUrl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public enum Mode {
        PRESENTIEL, EN_LIGNE, HYBRIDE
    }

    // ✅ Ajoute les Getters et Setters si pas encore générés
    // Ou utilise @Data si tu utilises Lombok
}
