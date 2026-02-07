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
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    // NEW: List of paths that should skip this filter
    private static final List<String> EXCLUDE_URLS = Arrays.asList(
            "/api/login",
            "/api/register",
            "/api/google-login",
            "/api/foods", // If you want food browsing to be public
            "/api/orders/notify" // For PayHere callbacks
    );

    /**
     * This method tells Spring to SKIP the filter entirely for specific URLs.
     * This prevents 403 errors if the frontend accidentally sends a "Bearer null" header during login.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        // Returns true if the path starts with any of the excluded URLs
        return EXCLUDE_URLS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Check if header is missing or doesn't start with Bearer
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 2. Extract Token
            String token = authHeader.substring(7);

            // Guard clause against "Bearer null" or "Bearer undefined" from frontend
            if (token.equals("null") || token.equals("undefined")) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtUtil.extractUsername(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log the error but don't stop the chain; let Spring Security handle the 403 gracefully
            System.err.println("JWT Authentication failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}