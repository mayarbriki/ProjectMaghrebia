package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Status;
import com.example.projectmaghrebia.Entities.Transaction;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ITransactionService {


    List<Transaction> getAllTransactions(); // Récupérer toutes les transactions
    Optional<Transaction> getTransactionById(Long id); // Récupérer une transaction par ID
    Transaction createTransaction(Transaction transaction); // Ajouter une nouvelle transaction
    Transaction updateTransaction(Long id, Transaction transactionDetails); // Mettre à jour une transaction
    void deleteTransaction(Long id); // Supprimer une transaction par ID


    Transaction confirmTransaction(Long transactionId);
    long countTransactionsByStatus(Status status);
    BigDecimal sumValidatedTransactionsAmount();
}
