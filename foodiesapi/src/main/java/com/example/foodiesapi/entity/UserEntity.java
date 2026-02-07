package com.example.foodiesapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
@Builder
public class UserEntity implements UserDetails { // 👈 1. MUST Implement UserDetails

    @Id
    private String id;
    private String name;
    private String email;

    @JsonIgnore // 👈 2. SECURITY FIX: Hide password from frontend API responses
    private String password;

    private String role; // e.g., "ROLE_DELIVERY", "ROLE_ADMIN"

    /**
     * boolean isAvailable
     * Used for Delivery Driver status (Online/Offline)
     */
    @Builder.Default
    private boolean isAvailable = true;

    // 👇 3. CRITICAL: This tells Spring Security what permissions the user has
    // Without this, you get 403 Forbidden errors!
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    // 👇 4. Spring Security uses this to find the "username" (we use email)
    @Override
    public String getUsername() {
        return email;
    }

    // --- Standard Boilerplate for Account Status (Always return true) ---
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}