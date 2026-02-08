package com.example.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactEntity {
    @Id
    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
}
