package com.example.food_order_backend.service;

import com.example.food_order_backend.dto.RegisterRequest;
import com.example.food_order_backend.model.User;
import com.example.food_order_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .addresses(request.getAddresses() == null ? null :
                        request.getAddresses().stream()
                                .map(a -> User.Address.builder()
                                        .label(a.getLabel())
                                        .line1(a.getLine1())
                                        .city(a.getCity())
                                        .postalCode(a.getPostalCode())
                                        .build())
                                .collect(Collectors.toList()))
                .build();

        return userRepository.save(user);   // this write auto-creates the 'users' collection
    }
}
