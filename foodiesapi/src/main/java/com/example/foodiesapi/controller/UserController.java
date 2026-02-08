package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.io.UserRequest;
import com.example.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthenticationResponse register(@RequestBody UserRequest request) {
        // Register user + return token (auto-login after register)
        return userService.registerAndReturnToken(request);
    }
}
