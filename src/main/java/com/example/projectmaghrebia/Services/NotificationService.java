package com.example.projectmaghrebia.Services;



import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTransactionNotification(String message) {
        messagingTemplate.convertAndSend("/topic/transactions", message);
    }
}
