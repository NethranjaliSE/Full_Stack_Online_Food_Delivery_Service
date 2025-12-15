package com.example.foodiesapi.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String phone;
    private String password;      // will store HASH
    private List<String> addresses;
    private String role;          // "USER" or "ADMIN"
}
