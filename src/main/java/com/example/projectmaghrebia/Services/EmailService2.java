package com.example.projectmaghrebia.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService2 {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ Envoi d'un email pour le renouvellement d'un contrat
    public void sendRenewalEmail(String recipientEmail, Long contractId) {
        String subject = "Renouvellement de votre contrat";
        String message = "Votre contrat (ID: " + contractId + ") a été renouvelé avec succès.";
        sendEmail(recipientEmail, subject, message);
    }

    // ✅ Envoi d'un email de rappel pour un contrat proche de l'expiration
    public void sendReminderEmail(String recipientEmail, Long contractId, String contractType) {
        String subject = "Rappel : Contrat bientôt expiré";
        String message = "Votre contrat de type " + contractType + " (ID: " + contractId + ") expirera bientôt. Veuillez prendre les mesures nécessaires.";
        sendEmail(recipientEmail, subject, message);
    }

    // ✅ Méthode générique pour envoyer un email
    private void sendEmail(String recipientEmail, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
}
