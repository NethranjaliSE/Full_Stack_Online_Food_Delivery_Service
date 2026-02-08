package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;

import java.util.List;

public interface UserService {

    // --- Authentication & User Management ---

    // Keep old method (so nothing breaks)
    UserResponse registerUser(UserRequest request);

    // NEW: register and return JWT token (auto-login after register)
    AuthenticationResponse registerAndReturnToken(UserRequest request);

    String findByUserId();

    AuthenticationResponse loginWithGoogle(String token);

    // --- Delivery Management ---
    List<UserEntity> getAllDeliveryPersonnel();
    List<UserEntity> getAvailableDeliveryBoys();
    void updateAvailability(String userId, boolean isAvailable);
    UserEntity getUserByEmail(String email);
}
