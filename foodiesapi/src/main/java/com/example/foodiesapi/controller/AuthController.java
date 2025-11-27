package com.example.foodiesapi.controller;

import com.example.foodiesapi.dto.LoginRequest;
import com.example.foodiesapi.dto.RegisterRequest;
import com.example.foodiesapi.entity.User;
import com.example.foodiesapi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest req) {
        return service.login(req);
    }
}
