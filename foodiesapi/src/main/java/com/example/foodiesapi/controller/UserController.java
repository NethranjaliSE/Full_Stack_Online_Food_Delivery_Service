package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.io.UserResponse;
import com.example.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    /**
     * Register a new user WITHOUT auto-login.
     * User must manually login after registration.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request) {
        // Register the user and return basic user info (no token)
        return userService.registerUser(request);
    }
}
