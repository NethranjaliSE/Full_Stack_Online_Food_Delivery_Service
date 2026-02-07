package com.example.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticationResponse {
    private String email;
    private String token;
    // Add this field to return the user's role to the frontend
    private String role;
}