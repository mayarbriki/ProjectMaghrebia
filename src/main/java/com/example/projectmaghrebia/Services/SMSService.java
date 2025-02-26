package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Configurations.TwilioConfig;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SMSService {

    private final TwilioConfig twilioConfig;

    @Autowired
    public SMSService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

    public void sendSMS(String message, String userPhoneNumber) {
        Message.creator(
                new PhoneNumber("+216" + userPhoneNumber), // User phone number (Tunisian format)
                new PhoneNumber(twilioConfig.getTwilioNumber()), // Twilio sender number
                message
        ).create();
    }
}
