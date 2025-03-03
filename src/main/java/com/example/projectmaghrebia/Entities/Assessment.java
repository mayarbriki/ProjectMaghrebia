package com.example.projectmaghrebia.Entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idAssessment;

    private Date assessmentDate;
    private String findings;

    @ElementCollection
    private List<String> assessmentDocuments = new ArrayList<>();


    @Enumerated(EnumType.STRING)
    private statusAssessment statusAssessment;

    @Enumerated(EnumType.STRING)
    private finalDecision finalDecision;

    private Date submissionDate;

    @OneToOne
    @JoinColumn(name = "claim_id")
    @JsonIgnoreProperties({"assessment"})
    private Claim claim;
}