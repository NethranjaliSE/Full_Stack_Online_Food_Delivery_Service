package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.ContactEntity;
import com.example.foodiesapi.repository.ContactRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactRepository contactRepository;

    // 1. User: Send a Message
    @PostMapping("/add")
    public ResponseEntity<?> addMessage(@RequestBody ContactEntity message) {
        contactRepository.save(message);
        return ResponseEntity.ok("Message sent successfully!");
    }

    // 2. Admin: Get All Messages
    @GetMapping("/all")
    public ResponseEntity<List<ContactEntity>> getAllMessages() {
        // Returns latest messages first (optional sorting logic can be added here)
        return ResponseEntity.ok(contactRepository.findAll());
    }

    // 3. Admin: Delete Message
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        contactRepository.deleteById(id);
        return ResponseEntity.ok("Message deleted");
    }
}