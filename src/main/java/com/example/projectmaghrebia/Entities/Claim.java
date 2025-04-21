package com.example.projectmaghrebia.Entities;

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

public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idClaim;

    private String fullName;
    private String claimName;
    private Date submissionDate;

    @Enumerated(EnumType.STRING)
    private statusClaim statusClaim;

    private String claimReason;
    private String description;

    private Long userId;

    @ElementCollection
    private List<String> supportingDocuments = new ArrayList<>();


    @OneToOne(mappedBy = "claim", cascade = CascadeType.ALL)
    private Assessment assessment;

}