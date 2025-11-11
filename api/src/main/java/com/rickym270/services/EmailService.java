package com.rickym270.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a contact form email notification
     * @param toEmail Recipient email address
     * @param fromEmail Sender email address
     * @param name Sender name
     * @param subject Email subject
     * @param message Email message content
     * @return true if email was sent successfully, false otherwise
     */
    public boolean sendContactEmail(String toEmail, String fromEmail, String name, String subject, String message) {
        String recipientEmail = getRecipientEmail();
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            System.err.println("[EmailService] Warning: CONTACT_EMAIL not configured, skipping email send");
            return false;
        }

        try {
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(recipientEmail);
            emailMessage.setFrom(getFromEmail());
            emailMessage.setSubject("Contact Form: " + subject);
            emailMessage.setText(buildEmailBody(name, fromEmail, subject, message));
            
            mailSender.send(emailMessage);
            System.out.println("[EmailService] Contact email sent successfully to " + recipientEmail);
            return true;
        } catch (Exception e) {
            System.err.println("[EmailService] Error sending email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private String buildEmailBody(String name, String email, String subject, String message) {
        return String.format(
            "New contact form submission from %s\n\n" +
            "Name: %s\n" +
            "Email: %s\n" +
            "Subject: %s\n\n" +
            "Message:\n%s\n\n" +
            "---\n" +
            "This email was sent from the contact form on rickym270.github.io",
            name, name, email, subject, message
        );
    }

    private String getRecipientEmail() {
        String env = System.getenv("CONTACT_EMAIL");
        if (env != null && !env.trim().isEmpty()) {
            return env.trim();
        }
        String prop = System.getProperty("CONTACT_EMAIL");
        return prop != null && !prop.trim().isEmpty() ? prop.trim() : null;
    }

    private String getFromEmail() {
        String env = System.getenv("SMTP_FROM_EMAIL");
        if (env != null && !env.trim().isEmpty()) {
            return env.trim();
        }
        String prop = System.getProperty("SMTP_FROM_EMAIL");
        return prop != null && !prop.trim().isEmpty() ? prop.trim() : "noreply@rickym270.github.io";
    }
}

