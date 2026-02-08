package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.ContactEntity;
import com.example.foodiesapi.io.ContactRequest;
import com.example.foodiesapi.repository.ContactRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ContactController {

    private final ContactRepository contactRepository;

    @PostMapping("/add")
    public ResponseEntity<java.util.Map<String, String>> saveMessage(@RequestBody ContactRequest request) {
        ContactEntity contactEntity = ContactEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        contactRepository.save(contactEntity);

        return ResponseEntity.ok(java.util.Map.of("message", "Message received successfully!"));
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<ContactEntity>> getAllMessages() {
        return ResponseEntity.ok(contactRepository.findAll());
    }
}
