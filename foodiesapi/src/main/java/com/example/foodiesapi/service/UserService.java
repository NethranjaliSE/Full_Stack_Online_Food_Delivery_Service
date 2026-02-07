package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity; // Needed for the list
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse registerUser(UserRequest request);
    String findByUserId();

    // Standard Google Login
    AuthenticationResponse loginWithGoogle(String token);

    /**
     * NEW: Get all users who have the role 'ROLE_DELIVERY' and are currently available.
     * This will be called by the Admin Controller to populate the assignment dropdown.
     */
    List<UserEntity> getAvailableDeliveryBoys();

    /**
     * NEW: Update the availability status of a delivery boy.
     * Called when an order is assigned (false) or delivered (true).
     */
    void updateAvailability(String userId, boolean isAvailable);
}