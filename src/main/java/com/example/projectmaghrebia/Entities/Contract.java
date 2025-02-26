package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contract_id;

    private Long user_id;
    private String contract_type;
    private Date start_date;
    private Date end_date;
    private String status;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Payment_frequency payment_type;

    private String signed_document;
    private Timestamp created_at;
    private Timestamp updated_at;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    private Set<Transaction> transactions;
}

