package com.example.projectmaghrebia.Entities;

// MailRequest.java
public class MailRequest {
    private String recipient;
    private Property property; // Replace Property with your actual property model class

    // Getters and setters
    public String getRecipient() {
        return recipient;
    }
    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
    public Property getProperty() {
        return property;
    }
    public void setProperty(Property property) {
        this.property = property;
    }
}
