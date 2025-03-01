package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Status;
import com.example.projectmaghrebia.Entities.Transaction;
import com.example.projectmaghrebia.Entities.Contract;
import com.example.projectmaghrebia.Services.ITransactionService;
import com.example.projectmaghrebia.Services.IContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    ITransactionService transactionService;

    @Autowired
    IContractService contractService; // Inject contract service

    @GetMapping("/")
    public ResponseEntity<String> index() {
        return ResponseEntity.ok("Welcome to the ProjectMaghrebia API root!");
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get all transactions", description = "Returns a list of all transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    @Operation(summary = "Get transaction by ID", description = "Returns a transaction by its ID")
    @ApiResponse(responseCode = "404", description = "Transaction not found")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);

        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        } else {
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Transaction not found\", \"id\": " + id + "}");
        }
    }

    @PostMapping
    @Operation(summary = "Create a new transaction with contract association", description = "Creates a new transaction and associates it with a contract")
    public ResponseEntity<?> createTransaction(@Valid @RequestBody Transaction transaction,
                                               @RequestParam Long contractId) { // Require contractId
        Optional<Contract> contractOptional = contractService.getContractById(contractId);
        if (contractOptional.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Contract not found\", \"contractId\": " + contractId + "}");
        }

        transaction.setContract(contractOptional.get());
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.created(URI.create("/transactions/" + createdTransaction.getTransaction_id()))
                .body(createdTransaction);
    }
    @GetMapping("/count/{status}")
    public long countTransactions(@PathVariable Status status) {
        return transactionService.countTransactionsByStatus(status);
    }

    @GetMapping("/sumValidatedAmount")
    public BigDecimal sumValidatedTransactionsAmount() {
        return transactionService.sumValidatedTransactionsAmount();
    }

    @PutMapping("/transactions/{id}")
    @Operation(summary = "Update a transaction", description = "Updates an existing transaction by ID")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
                                               @Valid @RequestBody Transaction transactionDetails) {
        Optional<Transaction> existingTransaction = transactionService.getTransactionById(id);

        if (existingTransaction.isPresent()) {
            Transaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails);
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Transaction not found\", \"id\": " + id + "}");
        }
    }

    @DeleteMapping("/transactions/{id}")
    @Operation(summary = "Delete a transaction", description = "Deletes a transaction by its ID")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        Optional<Transaction> existingTransaction = transactionService.getTransactionById(id);

        if (existingTransaction.isPresent()) {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Transaction not found\", \"id\": " + id + "}");
        }
    }
}
