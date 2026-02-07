package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;

import java.util.List;

public interface UserService {

    // --- Authentication & User Management ---
    UserResponse registerUser(UserRequest request);
    String findByUserId();
    AuthenticationResponse loginWithGoogle(String token);

    // --- Delivery Management ---

    /**
     * 1. Get ALL users with 'ROLE_DELIVERY' (Both Available and Busy).
     * Used for the Admin Dashboard "Driver List" page.
     */
    List<UserEntity> getAllDeliveryPersonnel();

    /**
     * 2. Get ONLY 'Available' delivery boys.
     * Used for the Admin "Assign Driver" dropdown.
     */
    List<UserEntity> getAvailableDeliveryBoys();

    /**
     * 3. Update driver availability.
     * Called when a driver goes Online/Offline or accepts a job.
     */
    void updateAvailability(String userId, boolean isAvailable);

    /**
     * 4. Find a user by Email.
     * Used by the Frontend to "discover" the real User ID if it is missing.
     */
    UserEntity getUserByEmail(String email);
}