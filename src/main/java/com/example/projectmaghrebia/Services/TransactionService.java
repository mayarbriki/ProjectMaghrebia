package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Status;
import com.example.projectmaghrebia.Entities.Transaction;
import com.example.projectmaghrebia.Repositories.TransactionRepositories;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class TransactionService implements ITransactionService {

    @Autowired
    private TransactionRepositories transactionRepository;

    @Autowired
    private SMSService smsService;  // Service for sending SMS

    @Autowired
    private EmailService emailService; // Service for sending email

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        transaction.setCreated_at(new Timestamp(System.currentTimeMillis()));
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + id));

        // Store previous status before update
        Status previousStatus = transaction.getStatus();

        // Update transaction details
        transaction.setUser_id(transactionDetails.getUser_id());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setPayment_method(transactionDetails.getPayment_method());
        transaction.setTransaction_date(transactionDetails.getTransaction_date());
        transaction.setStatus(transactionDetails.getStatus());
        transaction.setCreated_at(new Timestamp(System.currentTimeMillis()));

        // Save the updated transaction
        Transaction updatedTransaction = transactionRepository.save(transaction);

        // If status has changed, send notifications
        if (!previousStatus.equals(transactionDetails.getStatus())) {
            sendStatusChangeNotification(updatedTransaction);
        }

        return updatedTransaction;
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    @Override
    public Transaction confirmTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        if (!transaction.getStatus().equals(Status.PENDING)) {
            throw new RuntimeException("Only pending transactions can be confirmed.");
        }

        // Update status to CONFIRMED
        transaction.setStatus(Status. COMPLETED);


        // Save the confirmed transaction
        transactionRepository.save(transaction);

        // Send confirmation notifications (SMS & Email)
        sendConfirmationNotification(transaction);

        return transaction;
    }

    private void sendStatusChangeNotification(Transaction transaction) {
        String userPhoneNumber = "24483221";  // Fetch user's phone number dynamically from the database
        String message = "";

        switch (transaction.getStatus()) {
            case COMPLETED:
                message = "✅ Your transaction #" + transaction.getTransaction_id() + " is COMPLETED.";
                break;
            case FAILED:
                message = "⚠️ Your transaction #" + transaction.getTransaction_id() + " has FAILED.";
                break;
            case REFUNDED:
                message = "🔄 Your transaction #" + transaction.getTransaction_id() + " has been REFUNDED.";
                break;
            case PENDING:
                message = "⏳ Your transaction #" + transaction.getTransaction_id() + " is still PENDING.";
                break;
            default:
                return; // If status is unknown, do nothing
        }

        // Send SMS notification
        smsService.sendSMS(message, userPhoneNumber);
    }

    private void sendConfirmationNotification(Transaction transaction) {
        // Send Email Notification
          /*  String emailBody = "<h3>Transaction Confirmed</h3>"
                    + "<p>Your transaction of <b>" + transaction.getAmount() + " TND</b> has been confirmed successfully.</p>"
                    + "<p>Transaction ID: " + transaction.getTransaction_id() + "</p>"
                    + "<p>Confirmation Date: " + transaction.getConfirmed_at() + "</p>";

            emailService.sendEmail("ayoub.elfekih@esprit.tn",
                    "Transaction Confirmation",
                    emailBody); */

        // Send SMS Notification
        String smsMessage = "✅ Your transaction #" + transaction.getTransaction_id() + " has been confirmed.";
        smsService.sendSMS(smsMessage, "24483221"); // Replace XXXXXXXX with actual user phone number

    }
    public long countTransactionsByStatus(Status status) {
        return transactionRepository.countByStatus(status);
    }

    public BigDecimal sumValidatedTransactionsAmount() {
        return transactionRepository.sumAmountByStatus(Status.COMPLETED);
    }

}
