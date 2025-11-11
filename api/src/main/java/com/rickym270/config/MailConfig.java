package com.rickym270.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${spring.mail.host:}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // Get values from environment variables, system properties (.env), or default values
        String smtpHost = getEnvOrProperty("SMTP_HOST", host);
        String smtpPort = getEnvOrProperty("SMTP_PORT", String.valueOf(port));
        String smtpUsername = getEnvOrProperty("SMTP_USERNAME", username);
        String smtpPassword = getEnvOrProperty("SMTP_PASSWORD", password);
        
        if (smtpHost == null || smtpHost.trim().isEmpty()) {
            // No SMTP configured - return a no-op sender
            System.out.println("[MailConfig] No SMTP_HOST configured, email sending disabled");
            return new JavaMailSenderImpl();
        }
        
        mailSender.setHost(smtpHost);
        try {
            mailSender.setPort(Integer.parseInt(smtpPort));
        } catch (NumberFormatException e) {
            mailSender.setPort(587);
        }
        mailSender.setUsername(smtpUsername);
        mailSender.setPassword(smtpPassword);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.debug", "false");
        
        System.out.println("[MailConfig] SMTP configured: " + smtpHost + ":" + mailSender.getPort() + " (username: " + smtpUsername + ")");
        
        return mailSender;
    }
    
    private String getEnvOrProperty(String key, String defaultValue) {
        // Check environment variables first (highest priority)
        String env = System.getenv(key);
        if (env != null && !env.trim().isEmpty()) {
            return env.trim();
        }
        // Then check system properties (loaded from .env file)
        String prop = System.getProperty(key);
        if (prop != null && !prop.trim().isEmpty()) {
            return prop.trim();
        }
        return defaultValue;
    }
}

