package com.example.foodiesapi.service;

import com.example.foodiesapi.io.AuthenticationResponse; // Make sure this is imported
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);
    String findByUserId();

    // ADD THIS NEW METHOD
    AuthenticationResponse loginWithGoogle(String token);
}