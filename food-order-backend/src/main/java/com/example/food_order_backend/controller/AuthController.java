package com.example.food_order_backend.controller;

import com.example.food_order_backend.dto.AuthResponse;
import com.example.food_order_backend.dto.LoginRequest;
import com.example.food_order_backend.dto.RegisterRequest;
import com.example.food_order_backend.model.User;
import com.example.food_order_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    //@PostMapping("/login")
    //public User login(@Valid @RequestBody LoginRequest request) {
    //    return authService.login(request.getEmail(), request.getPassword());
    //} 
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
    }
    // Protected endpoint: full URL = http://localhost:8080/api/auth/test/hello
    @GetMapping("/test/hello")
    public String hello() {
        return "hello secure";
    } 
    @GetMapping("/me")
    public User me() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return authService.getByEmail(email);
    } 
      

}

