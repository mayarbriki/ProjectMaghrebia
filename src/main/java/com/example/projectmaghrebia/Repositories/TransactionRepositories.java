package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepositories extends JpaRepository<Transaction,Long> {
}
