package com.example.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
@Builder
public class UserEntity {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;

    private String role; // ROLE_USER, ROLE_ADMIN, ROLE_DELIVERY

    /**
     * boolean isAvailable
     * MongoDB field will be "isAvailable"
     */
    @Builder.Default
    private boolean isAvailable = true;
}