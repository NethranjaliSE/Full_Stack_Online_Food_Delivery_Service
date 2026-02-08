package com.example.foodiesapi.filters;

import com.example.foodiesapi.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * Optional optimization: Don't try JWT for public endpoints.
     * (Even if you remove this, JWT still works.)
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/api/login")
                || path.equals("/api/register")
                || path.equals("/api/google-login")
                || path.startsWith("/api/foods/")
                || path.equals("/api/orders/notify")
                || path.startsWith("/api/contact/");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1) Check if header is missing or invalid
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) Extract token
        final String token = authHeader.substring(7).trim();

        // 3) Safety check for bad frontend strings
        if (!StringUtils.hasText(token) || "null".equalsIgnoreCase(token) || "undefined".equalsIgnoreCase(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 4) Extract email/username from token
            final String email = jwtUtil.extractUsername(token);

            // 5) If already authenticated, continue
            if (email == null || SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 6) Load user
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // 7) Validate token
            if (jwtUtil.validateToken(token, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {
            // If token is invalid/expired, do not authenticate
            SecurityContextHolder.clearContext();
            System.err.println("JWT authentication failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
