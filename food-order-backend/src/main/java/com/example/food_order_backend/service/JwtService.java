package com.example.food_order_backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // random 256-bit key encoded as Base64 (example only – change to your own)
    private static final String SECRET_KEY =
            "u7q8wZc2x5v8y/B?E(H+MbQeThWmZq4t7w!z%C*F-J@NcRfU";

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // generate token for a user email
    public String generateToken(String email) {
        long now = System.currentTimeMillis();
        long expiresInMs = 1000 * 60 * 60 * 24; // 24 hours

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiresInMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // extract email (subject) from token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, String email) {
        String tokenEmail = extractEmail(token);
        return tokenEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }
}
