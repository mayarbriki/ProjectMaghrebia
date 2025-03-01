package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Setter
@Getter
@Data
@Entity
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @OneToOne(mappedBy = "incident", cascade = CascadeType.ALL)
    private Appointment appointment;
}
