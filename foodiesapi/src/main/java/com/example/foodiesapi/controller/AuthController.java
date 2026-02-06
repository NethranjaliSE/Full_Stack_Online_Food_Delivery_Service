package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.AuthenticationRequest;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.service.AppUserDetailsService;
import com.example.foodiesapi.service.UserService; // Make sure this is imported
import com.example.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    // 1. Inject UserService to handle Google logic
    private final UserService userService;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(request.getEmail(), jwtToken);
    }

    // 2. Add the Google Login Endpoint
    @PostMapping("/google-login")
    public ResponseEntity<AuthenticationResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        // We are delegating the logic to UserService (we will update this next)
        AuthenticationResponse response = userService.loginWithGoogle(request.getToken());
        return ResponseEntity.ok(response);
    }
}

// 3. Simple DTO for receiving the token (You can move this to your .io package if you prefer)
@Data
@NoArgsConstructor
@AllArgsConstructor
class GoogleLoginRequest {
    private String token;
}