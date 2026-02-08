package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@AllArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // role from DB: could be "ADMIN" or "ROLE_ADMIN"
        String role = user.getRole();

        // default role if missing
        if (!StringUtils.hasText(role)) {
            role = "USER";
        }

        // normalize to Spring format: ROLE_XXX
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(role))
        );
    }
}
