package com.example.projectmaghrebia.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService2 {




        @Autowired
        private JavaMailSender mailSender;

        public void sendReminderEmail(String toEmail, Long contractId, String contractType) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("📌 Rappel : Votre contrat expire bientôt !");
            message.setText("Bonjour,\n\nVotre contrat #" + contractId + " de type '" + contractType +
                    "' expire dans moins de 24 heures. Pensez à le renouveler.\n\nCordialement,\nVotre Assurance.");

            mailSender.send(message);
        }
    }




