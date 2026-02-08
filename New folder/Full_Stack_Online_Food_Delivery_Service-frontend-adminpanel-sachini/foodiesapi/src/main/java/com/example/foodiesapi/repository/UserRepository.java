package com.example.foodiesapi.repository;

import com.example.foodiesapi.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {

    // Existing method for login logic
    Optional<UserEntity> findByEmail(String email);

    // Existing method to find users by role (e.g., all admins or all users)
    List<UserEntity> findByRole(String role);

    /**
     * NEW: Find all delivery boys who are currently marked as available.
     * This will be used by the Admin to populate the "Assign Delivery Boy" dropdown.
     */
    List<UserEntity> findByRoleAndIsAvailableTrue(String role);

    /**
     * NEW: Find all delivery boys regardless of availability.
     * Useful for admin management dashboards.
     */
    List<UserEntity> findByRoleAndIsAvailable(String role, boolean isAvailable);
}