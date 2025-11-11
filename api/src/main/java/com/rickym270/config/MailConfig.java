package com.rickym270.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        String host = firstNonBlank(env("SMTP_HOST"), prop("SMTP_HOST"), prop("spring.mail.host"));
        String portStr = firstNonBlank(env("SMTP_PORT"), prop("SMTP_PORT"), prop("spring.mail.port"));
        String username = firstNonBlank(env("SMTP_USERNAME"), prop("SMTP_USERNAME"), prop("spring.mail.username"));
        String password = firstNonBlank(env("SMTP_PASSWORD"), prop("SMTP_PASSWORD"), prop("spring.mail.password"));

        if (isBlank(host) || isBlank(portStr)) {
            System.out.println("[MailConfig] SMTP not configured (missing SMTP_HOST/SMTP_PORT). Email sending will be disabled.");
            // Return a sender with no host; EmailService will detect and skip sending
            return mailSender;
        }

        int port;
        try {
            port = Integer.parseInt(portStr);
        } catch (NumberFormatException e) {
            System.out.println("[MailConfig] Invalid SMTP_PORT: " + portStr + ". Email sending will be disabled.");
            return mailSender;
        }

        mailSender.setHost(host);
        mailSender.setPort(port);
        if (!isBlank(username)) {
            mailSender.setUsername(username);
        }
        if (!isBlank(password)) {
            mailSender.setPassword(password);
        }

        Properties props = mailSender.getJavaMailProperties();
        // Sensible defaults; can be overridden via spring.mail.properties.*
        props.putIfAbsent("mail.transport.protocol", "smtp");
        props.putIfAbsent("mail.smtp.auth", String.valueOf(!isBlank(username)));
        props.putIfAbsent("mail.smtp.starttls.enable", "true");
        props.putIfAbsent("mail.debug", "false");

        System.out.println("[MailConfig] SMTP configured: " + host + ":" + port + " (username: " + (isBlank(username) ? "<none>" : username) + ")");
        return mailSender;
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


