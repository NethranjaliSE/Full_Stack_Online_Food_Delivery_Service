package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.dto.LoginRequest;
import com.example.foodiesapi.dto.RegisterRequest;
import com.example.foodiesapi.entity.User;
import com.example.foodiesapi.repository.UserRepository;
import com.example.foodiesapi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public User register(RegisterRequest req) {
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword()); // normally hash
        user.setAddress(req.getAddress());
        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest req) {
        return userRepository.findByEmail(req.getEmail())
                .filter(u -> u.getPassword().equals(req.getPassword()))
                .orElse(null);
    }
}
