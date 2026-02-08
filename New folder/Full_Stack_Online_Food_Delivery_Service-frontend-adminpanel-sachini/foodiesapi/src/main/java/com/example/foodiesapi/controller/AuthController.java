package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.AuthenticationRequest;
import com.example.foodiesapi.io.AuthenticationResponse;
import com.example.foodiesapi.service.AppUserDetailsService;
import com.example.foodiesapi.service.UserService;
import com.example.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
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
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        // 1. Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Load UserDetails (This now contains the Role thanks to our AppUserDetailsService update)
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // 3. Generate the JWT
        final String jwtToken = jwtUtil.generateToken(userDetails);

        // 4. Extract the role string from authorities
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        // 5. Return the response with all 3 required fields: email, token, and role
        return ResponseEntity.ok(new AuthenticationResponse(request.getEmail(), jwtToken, role));
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthenticationResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        // The UserService.loginWithGoogle implementation already returns 3 arguments
        AuthenticationResponse response = userService.loginWithGoogle(request.getToken());
        return ResponseEntity.ok(response);
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class GoogleLoginRequest {
    private String token;
}