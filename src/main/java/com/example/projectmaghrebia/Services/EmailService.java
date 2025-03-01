package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPropertyAddedEmail(String recipient, Property property) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient);
        message.setSubject("New Property Added");
        message.setText("A new property has been added:\n\nAddress: " + property.getAddress() +
                "\nType: " + property.getPropertyType());

        mailSender.send(message);
    }
}
