package com.example.foodiesapi.repository;

import com.example.foodiesapi.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {

    // 1. Login Logic
    Optional<UserEntity> findByEmail(String email);

    // 2. Admin Management (See all drivers, even offline ones)
    List<UserEntity> findByRole(String role);

    // 3. Admin Assign Dropdown (See ONLY Online drivers)
    // This looks for: role = ? AND isAvailable = true
    List<UserEntity> findByRoleAndIsAvailableTrue(String role);

    // 4. Flexible Query (Find drivers by specific status)
    // This looks for: role = ? AND isAvailable = ? (you pass true/false)
    List<UserEntity> findByRoleAndIsAvailable(String role, boolean isAvailable);
}