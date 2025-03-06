package com.example.projectmaghrebiauser.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendProductEmail(String toEmail, String productName, String productDescription, String couponCode, double discountAmount) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Your Requested Product Details & Discount Coupon");
        helper.setText(
                "<h1>Product Details</h1>" +
                        "<p><strong>Name:</strong> " + productName + "</p>" +
                        "<p><strong>Description:</strong> " + productDescription + "</p>" +
                        "<h2>Your Discount Coupon</h2>" +
                        "<p>Use the following coupon code to get a " + discountAmount + "% discount on your next purchase:</p>" +
                        "<p><strong>Coupon Code:</strong> " + couponCode + "</p>",
                true // Enable HTML
        );

        mailSender.send(message);
    }
    public void sendReferralEmail(String to, String referrerUsername, String productName, String productDescription) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(referrerUsername + " Shared a Great Product with You!");
        helper.setText(
                "<p>Hi there,</p>" +
                        "<p>" + referrerUsername + " thought you’d love this:</p>" +
                        "<h3>" + productName + "</h3>" +
                        "<p>" + productDescription + "</p>" +
                        "<p>Check it out on our site!</p>",
                true
        );
        mailSender.send(message);
    }
}