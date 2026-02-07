package com.example.foodiesapi.config;

import com.example.foodiesapi.filters.JwtAuthenticationFilter;
import com.example.foodiesapi.service.AppUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS: Must be configured first to handle Preflight (OPTIONS) requests
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF: Disabled for Stateless JWT-based authentication
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints: Accessible without any token
                        .requestMatchers(
                                "/api/register",
                                "/api/login",
                                "/api/google-login",
                                "/api/foods/**",
                                "/api/orders/notify"
                        ).permitAll()

                        // Admin Only: Requires ROLE_ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/orders/all").hasRole("ADMIN")
                        .requestMatchers("/api/orders/status/**").hasRole("ADMIN")

                        // Delivery Partner Only: Requires ROLE_DELIVERY
                        .requestMatchers("/api/delivery/**").hasRole("DELIVERY")

                        // Secure all other requests (Place order, etc.)
                        .anyRequest().authenticated()
                )

                // 4. Session Management: Stateless because we use JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. JWT Filter: Intercepts requests to validate tokens before Username/Password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed Origins: Covers all potential React development ports
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175"
        ));

        // Allowed Methods: Includes PATCH for status updates
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Allowed Headers: Must include Authorization for the Bearer token
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }
}