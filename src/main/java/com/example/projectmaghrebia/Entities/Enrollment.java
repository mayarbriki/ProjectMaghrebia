package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔑 Liaison par ID
    private Long userId;
    private Long trainingId;

    // 🧾 Infos personnelles (optionnel si déjà stockées ailleurs)
    private String nom;
    private String prenom;
    private String cin;
    private String formation;

    // 📅 Date d'inscription
    private LocalDate enrolledAt;

}
