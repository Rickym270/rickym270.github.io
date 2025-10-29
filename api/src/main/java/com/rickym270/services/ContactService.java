package com.rickym270.services;

import com.rickym270.dto.ContactMessage;
import com.rickym270.dto.ContactRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ContactService {

    private final List<ContactMessage> messages = Collections.synchronizedList(new ArrayList<>());

    public ContactMessage save(ContactRequest dto) {
        ContactMessage message = new ContactMessage(
            UUID.randomUUID(),
            dto.name(),
            dto.email(),
            dto.message(),
            Instant.now()
        );
        messages.add(message);
        return message;
    }

    public List<ContactMessage> findAll() {
        synchronized (messages) {
            return new ArrayList<>(messages);
        }
    }
}



