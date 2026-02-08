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

import java.util.Collections;

@Service
@AllArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findFirstByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        /**
         * UPDATED: Instead of Collections.emptyList(), we now pass the user's role.
         * Spring Security expects roles to be granted authorities.
         * Ensure your roles in MongoDB are "ROLE_USER", "ROLE_ADMIN", or
         * "ROLE_DELIVERY".
         */
        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }
}