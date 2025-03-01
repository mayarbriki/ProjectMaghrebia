package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Status;
import com.example.projectmaghrebia.Entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface TransactionRepositories extends JpaRepository<Transaction,Long> {
    long countByStatus(Status status);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") Status status);
}
