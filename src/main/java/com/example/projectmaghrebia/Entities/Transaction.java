package com.example.projectmaghrebia.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transaction_id;

    private Long user_id;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Payment_method payment_method;

    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp transaction_date;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp created_at;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_contract_id")
    @JsonBackReference // ✅ Prevents infinite loop
    private Contract contract;


}
