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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

        try {
            // 1) Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // 2) Load user (must include ROLE_...)
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // 3) Generate JWT
        final String jwtToken = jwtUtil.generateToken(userDetails);

        // 4) Extract first role (ex: ROLE_ADMIN / ROLE_DELIVERY / ROLE_USER)
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        // 5) Return (email, token, role) — keep same format for frontend
        return ResponseEntity.ok(new AuthenticationResponse(userDetails.getUsername(), jwtToken, role));
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthenticationResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
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
