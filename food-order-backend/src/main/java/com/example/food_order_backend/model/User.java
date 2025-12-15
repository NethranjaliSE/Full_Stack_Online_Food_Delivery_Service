package com.example.food_order_backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")   // MongoDB collection name; auto-created
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private String phone;

    // only password hash is stored
    private String passwordHash;

    private List<Address> addresses;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String label;
        private String line1;
        private String city;
        private String postalCode;
    }
}
