package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;
import com.example.foodiesapi.repository.UserRepository;
import com.example.foodiesapi.util.JwtUtil; // Import JwtUtil
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate; // Import RestTemplate

import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AutthenticationFacade autthenticationFacade;

    // Inject these two to handle token generation
    private final JwtUtil jwtUtil;
    private final AppUserDetailsService userDetailsService;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
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
        // 1. Verify the token with Google
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;

        Map<String, Object> googleData;
        try {
            // This calls Google to check if the token is real
            googleData = restTemplate.getForObject(googleUrl, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Google Token");
        }

        if (googleData == null || googleData.get("email") == null) {
            throw new RuntimeException("Invalid Google Token Data");
        }

        String email = (String) googleData.get("email");
        String name = (String) googleData.get("name");

        // 2. Check if user exists. If not, register them automatically.
        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            return userRepository.save(UserEntity.builder()
                    .email(email)
                    .name(name)
                    // We generate a random password for Google users since they don't use it
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .build());
        });

        // 3. Generate a JWT Token for your app
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return new AuthenticationResponse(email, jwtToken);
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser) {
        return UserResponse.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .build();
    }
}