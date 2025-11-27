package com.example.foodiesapi.service;

import com.example.foodiesapi.dto.LoginRequest;
import com.example.foodiesapi.dto.RegisterRequest;
import com.example.foodiesapi.entity.User;

public interface AuthService {
    User register(RegisterRequest request);
    User login(LoginRequest request);
}
