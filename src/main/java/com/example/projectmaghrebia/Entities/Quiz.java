package com.example.projectmaghrebia.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    private String optionA;
    private String optionB;
    private String optionC;

    private String correctAnswer;

    // 🧠 Pour l'envoi au frontend
    @JsonProperty("options")
    public List<String> getOptions() {
        return Arrays.asList(optionA, optionB, optionC).stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // 🔁 Pour recevoir depuis Angular
    @JsonProperty("options")
    public void setOptions(List<String> options) {
        this.optionA = options.size() > 0 ? options.get(0) : null;
        this.optionB = options.size() > 1 ? options.get(1) : null;
        this.optionC = options.size() > 2 ? options.get(2) : null;
    }

    @ManyToOne
    @JoinColumn(name = "training_id")
    @JsonBackReference // évite la boucle JSON côté API
    private Training training;
}
