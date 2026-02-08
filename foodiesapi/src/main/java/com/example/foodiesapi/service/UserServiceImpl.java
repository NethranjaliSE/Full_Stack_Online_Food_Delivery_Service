package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;
import com.example.foodiesapi.repository.UserRepository;
import com.example.foodiesapi.service.UserService;
import com.example.foodiesapi.service.AppUserDetailsService;
import com.example.foodiesapi.util.JwtUtil;
import com.example.foodiesapi.service.AutthenticationFacade;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AutthenticationFacade autthenticationFacade;
    private final JwtUtil jwtUtil;
    private final AppUserDetailsService userDetailsService;

    // --- Delivery Management ---

    @Override
    public List<UserEntity> getAllDeliveryPersonnel() {
        return userRepository.findByRole("ROLE_DELIVERY");
    }

    @Override
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // --- Authentication & User Management ---

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);

        // Role from request OR default
        String role = request.getRole();
        if (!StringUtils.hasText(role)) {
            role = "USER";
        }
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        newUser.setRole(role);

        newUser.setAvailable(true);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    /**
     * NEW: Register user and return JWT token (auto-login after registration)
     */
    @Override
    public AuthenticationResponse registerAndReturnToken(UserRequest request) {

        // Optional safety: prevent duplicate emails
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already registered");
        });

        // Save user first (same as registerUser)
        UserEntity newUser = convertToEntity(request);

        String role = request.getRole();
        if (!StringUtils.hasText(role)) {
            role = "USER";
        }
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        newUser.setRole(role);

        newUser.setAvailable(true);
        userRepository.save(newUser);

        // Generate JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtUtil.generateToken(userDetails);

        String finalRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        return new AuthenticationResponse(userDetails.getUsername(), jwtToken, finalRole);
    }

    @Override
    public String findByUserId() {
        String loggedInUserEmail = autthenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedInUser.getId();
    }

    @Override
    public AuthenticationResponse loginWithGoogle(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;

        Map<String, Object> googleData;
        try {
            googleData = restTemplate.getForObject(googleUrl, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Google Authentication Failed: Invalid Token");
        }

        if (googleData == null || googleData.get("email") == null) {
            throw new RuntimeException("Google Authentication Failed: No email found");
        }

        String email = (String) googleData.get("email");
        String name = (String) googleData.get("name");

        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity newUser = UserEntity.builder()
                    .email(email)
                    .name(name)
                    .role("ROLE_USER")
                    .isAvailable(false)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .build();
            return userRepository.save(newUser);
        });

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return new AuthenticationResponse(email, jwtToken, user.getRole());
    }

    @Override
    public List<UserEntity> getAvailableDeliveryBoys() {
        return userRepository.findByRoleAndIsAvailableTrue("ROLE_DELIVERY");
    }

    @Override
    public void updateAvailability(String userId, boolean isAvailable) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvailable(isAvailable);
        userRepository.save(user);
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
