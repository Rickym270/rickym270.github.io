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

    public void sendContactEmail(String toEmail, String replyToEmail, String name, String subject, String message) {
        // Determine from and recipient
        String recipient = firstNonBlank(env("CONTACT_EMAIL"), prop("CONTACT_EMAIL"), toEmail);
        String from = firstNonBlank(env("SMTP_FROM_EMAIL"), prop("SMTP_FROM_EMAIL"), env("SMTP_USERNAME"), prop("SMTP_USERNAME"));

        // If JavaMailSender is not configured (no host), this will throw or fail fast.
        // We will guard and skip sending if we detect no host configured.
        try {
            // Cheap check: JavaMailSenderImpl has getHost(), but interface doesn't expose it.
            // We rely on a safe send attempt inside try/catch.
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(recipient);
            if (!isBlank(from)) {
                mail.setFrom(from);
            }
            if (!isBlank(replyToEmail)) {
                mail.setReplyTo(replyToEmail);
            }
            mail.setSubject("[Contact] " + subject + " — from " + name);
            mail.setText("From: " + name + " <" + replyToEmail + ">\n\n" + message);
            mailSender.send(mail);
            System.out.println("[EmailService] Contact email sent successfully to " + recipient);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send contact email: " + e.getMessage());
            // Print full stack trace for debugging authentication issues
            if (e.getMessage() != null && e.getMessage().contains("Authentication")) {
                System.err.println("[EmailService] Full error details:");
                e.printStackTrace();
            }
            throw e;
        }
    }

    private static String env(String key) {
        return System.getenv(key);
    }

    private static String prop(String key) {
        return System.getProperty(key);
    }

    private static String firstNonBlank(String... values) {
        for (String v : values) {
            if (!isBlank(v)) return v.trim();
        }
        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}


